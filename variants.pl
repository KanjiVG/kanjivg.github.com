#!/home/ben/software/install/bin/perl
use Z;
my $verbose;
my $infile = <$Bin/variants.html>;
my $html = read_text ($infile);
my $actual = `/home/ben/projects/kvgcheck/variants.pl`;
my %actual;
my @lines = split (/\s*\n\s*/, $actual);
for (@lines) {
    if ($verbose) {
	print "$_\n";
    }
    $actual{$_} = 1;
}
my %has;
while ($html =~ m!<dt>(.*)</dt>!g) {
    my $v = $1;
    if ($verbose) {
	print "$v\n";
    }
    $has{$v} = 1;
    if (! $actual{$v}) {
	print "$v not in actual list\n";
    }
}
for my $k (keys %actual) {
    my @split = ($k =~ /([A-Z][^A-Z]+)/);
    for (@split) {
	if (! $has{$_}) {
	    print "Missing component $_\n";
	}
    }
    if (! $has{$k}) {
	print "$k is not in the list yet\n";
    }
}

