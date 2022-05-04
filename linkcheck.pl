#!/usr/bin/env perl

# This script checks the HTML files for bad internal links and poor
# formatting, such as single quotes '' around href in a link.

use warnings;
use strict;
use utf8;
use FindBin '$Bin';
use File::Slurper qw!read_text!;

binmode STDOUT, ":encoding(utf8)";

my $glossary = read_text ("$Bin/glossary.html");
my %gloss_id;
while ($glossary =~ /id="(.*)"/g) {
    $gloss_id{$1} = 1;
}
my @links;
my @files = <*.html>;
for my $file (@files) {
    my $text = read_text ($file);
    my %ids;
    while ($text =~ /(href|id)='(.*)'/g) {
	my $type = $1;
	my $id = $2;
	print "Single quotes around $type $id in $file\n";
    }
    while ($text =~ /id="(.*?)"/g) {
	my $id = $1;
	$ids{$id} = 1;
	if ($id =~ /^#/) {
	    print "$file: bad id $id with #\n";
	}
#	print "Added id $id\n";
    }
    while ($text =~ /href="(.*?)"/g) {
	my $link = $1;
	if ($link =~ /glossary\.html#(.*)/) {
	    my $id = $1;
	    if (! $gloss_id{$id}) {
		print "Bad link in $file to glossary id $id\n";
	    }
	}
	if ($link =~ /^#(.*)/) {
	    my $id = $1;
	    if (! $ids{$id}) {
		print "Bad link in $file to self-id $id\n";
	    }
	}
	if ($link !~ /^#/ &&
	    $link !~ /^[a-z_-]+\.html(?:#[a-z_-]+)?$/ &&
	    $link !~ m!^https?://! &&
	    $link !~ /viewer/) {
	    print "$file: Possible bad link $link\n";
	}
	push @links, $link;
    }
}
