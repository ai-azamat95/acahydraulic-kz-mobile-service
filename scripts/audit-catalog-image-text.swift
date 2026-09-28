#!/usr/bin/env swift

import AppKit
import Foundation
import ImageIO
import Vision

struct Finding: Codable {
    let path: String
    let matches: [RecognizedLine]
    let recognizedText: [String]
}

struct NormalizedBox: Codable {
    let x: Double
    let y: Double
    let width: Double
    let height: Double
}

struct RecognizedLine: Codable {
    let text: String
    let confidence: Float
    let box: NormalizedBox
}

struct Failure: Codable {
    let path: String
    let error: String
}

struct Report: Codable {
    let generatedAt: String
    let roots: [String]
    let filesScanned: Int
    let matches: [Finding]
    let failures: [Failure]
}

final class Results: @unchecked Sendable {
    private let lock = NSLock()
    private(set) var findings: [Finding] = []
    private(set) var failures: [Failure] = []
    private(set) var scanned = 0

    func record(finding: Finding?) {
        lock.lock()
        scanned += 1
        if let finding { findings.append(finding) }
        if scanned % 1_000 == 0 {
            FileHandle.standardError.write(Data("OCR progress: \(scanned) images\n".utf8))
        }
        lock.unlock()
    }

    func record(failure: Failure) {
        lock.lock()
        scanned += 1
        failures.append(failure)
        if scanned % 1_000 == 0 {
            FileHandle.standardError.write(Data("OCR progress: \(scanned) images\n".utf8))
        }
        lock.unlock()
    }
}

func usage() -> Never {
    FileHandle.standardError.write(Data("Usage: swift scripts/audit-catalog-image-text.swift (--root DIR | --file-list FILE) [--output FILE] [--jobs N] [--limit N] [--accurate | --small-text] [--tiled] [--include-tagline]\n".utf8))
    exit(2)
}

var roots: [String] = []
var fileListPath: String?
var outputPath = "catalog-image-text-audit.json"
var jobs = max(1, min(ProcessInfo.processInfo.activeProcessorCount, 8))
var limit: Int?
var accurate = false
var includeTagline = false
var smallText = false
var tiled = false
var index = 1
let arguments = CommandLine.arguments

while index < arguments.count {
    switch arguments[index] {
    case "--root":
        guard index + 1 < arguments.count else { usage() }
        roots.append(arguments[index + 1])
        index += 2
    case "--output":
        guard index + 1 < arguments.count else { usage() }
        outputPath = arguments[index + 1]
        index += 2
    case "--file-list":
        guard index + 1 < arguments.count else { usage() }
        fileListPath = arguments[index + 1]
        index += 2
    case "--jobs":
        guard index + 1 < arguments.count, let value = Int(arguments[index + 1]), value > 0 else { usage() }
        jobs = value
        index += 2
    case "--limit":
        guard index + 1 < arguments.count, let value = Int(arguments[index + 1]), value > 0 else { usage() }
        limit = value
        index += 2
    case "--accurate":
        accurate = true
        index += 1
    case "--include-tagline":
        includeTagline = true
        index += 1
    case "--small-text":
        smallText = true
        index += 1
    case "--tiled":
        tiled = true
        index += 1
    default:
        usage()
    }
}

guard !roots.isEmpty || fileListPath != nil else { usage() }

let supportedExtensions = Set(["avif", "gif", "heic", "jpeg", "jpg", "png", "tif", "tiff", "webp"])
let manager = FileManager.default
var files: [String] = []

for root in roots {
    let absoluteRoot = URL(fileURLWithPath: root).standardizedFileURL.path
    guard let enumerator = manager.enumerator(atPath: absoluteRoot) else {
        FileHandle.standardError.write(Data("Cannot enumerate root: \(absoluteRoot)\n".utf8))
        exit(2)
    }
    while let relative = enumerator.nextObject() as? String {
        let ext = URL(fileURLWithPath: relative).pathExtension.lowercased()
        if supportedExtensions.contains(ext) {
            files.append(URL(fileURLWithPath: absoluteRoot).appendingPathComponent(relative).path)
        }
    }
}

if let fileListPath {
    let listed = try String(contentsOfFile: fileListPath, encoding: .utf8)
        .split(whereSeparator: \ .isNewline)
        .map(String.init)
        .filter { !$0.isEmpty }
    files.append(contentsOf: listed)
}

files = Array(Set(files)).sorted()
if let limit, files.count > limit {
    files = Array(files.prefix(limit))
}

let results = Results()
let supplierMarks = includeTagline ? ["sinocmp", "genuineparts"] : ["sinocmp"]

let normalized: @Sendable (String) -> String = { value in
    value.lowercased().unicodeScalars
        .filter { CharacterSet.alphanumerics.contains($0) }
        .map(String.init)
        .joined()
        .replacingOccurrences(of: "0", with: "o")
}

func inspect(_ path: String) {
    let url = URL(fileURLWithPath: path) as CFURL
    guard let source = CGImageSourceCreateWithURL(url, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        results.record(failure: Failure(path: path, error: "ImageIO could not decode image"))
        return
    }

    do {
        let regions = tiled ? [
            CGRect(x: 0.0, y: 0.0, width: 0.58, height: 0.58),
            CGRect(x: 0.42, y: 0.0, width: 0.58, height: 0.58),
            CGRect(x: 0.0, y: 0.42, width: 0.58, height: 0.58),
            CGRect(x: 0.42, y: 0.42, width: 0.58, height: 0.58),
        ] : [CGRect(x: 0, y: 0, width: 1, height: 1)]
        var lines: [String] = []
        var matches: [RecognizedLine] = []
        for region in regions {
            let request = VNRecognizeTextRequest()
            request.recognitionLevel = accurate ? .accurate : .fast
            request.usesLanguageCorrection = false
            request.minimumTextHeight = (accurate || smallText) ? 0.004 : 0.012
            request.recognitionLanguages = ["en-US"]
            request.regionOfInterest = region
            try VNImageRequestHandler(cgImage: image, options: [:]).perform([request])
            let observations = request.results ?? []
            lines.append(contentsOf: observations.compactMap { $0.topCandidates(1).first?.string })
            matches.append(contentsOf: observations.compactMap { observation -> RecognizedLine? in
                guard let candidate = observation.topCandidates(1).first else { return nil }
                let text = normalized(candidate.string)
                guard supplierMarks.contains(where: { text.contains($0) }) else { return nil }
                let box = observation.boundingBox
                return RecognizedLine(
                    text: candidate.string,
                    confidence: candidate.confidence,
                    box: NormalizedBox(x: box.origin.x, y: box.origin.y, width: box.width, height: box.height)
                )
            })
        }
        results.record(finding: matches.isEmpty ? nil : Finding(path: path, matches: matches, recognizedText: lines))
    } catch {
        results.record(failure: Failure(path: path, error: String(describing: error)))
    }
}

let queue = OperationQueue()
queue.maxConcurrentOperationCount = jobs
for path in files {
    queue.addOperation { inspect(path) }
}
queue.waitUntilAllOperationsAreFinished()

let formatter = ISO8601DateFormatter()
let report = Report(
    generatedAt: formatter.string(from: Date()),
    roots: roots.map { URL(fileURLWithPath: $0).standardizedFileURL.path },
    filesScanned: results.scanned,
    matches: results.findings.sorted { $0.path < $1.path },
    failures: results.failures.sorted { $0.path < $1.path }
)
let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
let data = try encoder.encode(report)
try data.write(to: URL(fileURLWithPath: outputPath), options: .atomic)
print("Scanned \(report.filesScanned) images; \(report.matches.count) supplier-text matches; \(report.failures.count) failures")
print("Report: \(URL(fileURLWithPath: outputPath).standardizedFileURL.path)")

if !report.matches.isEmpty || !report.failures.isEmpty {
    exit(1)
}
