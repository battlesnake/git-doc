#!/usr/bin/perl

while (<>) {
	if (m/^#\s/) {
		s/^#\s+//;
		print;
		last;
	}
}
