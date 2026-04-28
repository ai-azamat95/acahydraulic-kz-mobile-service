ALTER TABLE `leads` MODIFY COLUMN `status` enum('new','urgent','in_progress','completed','rejected') NOT NULL DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `leads` ADD `priority` int DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `aiSummary` text;