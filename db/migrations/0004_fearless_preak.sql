CREATE INDEX "characters_user_id_idx" ON "characters" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "doctrine_ships_doctrine_id_idx" ON "doctrine_ships" USING btree ("doctrine_id");--> statement-breakpoint
CREATE INDEX "fleets_alliance_id_idx" ON "fleets" USING btree ("alliance_id");--> statement-breakpoint
CREATE INDEX "fleets_status_idx" ON "fleets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "fleets_alliance_status_idx" ON "fleets" USING btree ("alliance_id","status");--> statement-breakpoint
CREATE INDEX "srp_requests_fleet_id_idx" ON "srp_requests" USING btree ("fleet_id");--> statement-breakpoint
CREATE INDEX "srp_requests_status_idx" ON "srp_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "srp_requests_fleet_status_idx" ON "srp_requests" USING btree ("fleet_id","status");