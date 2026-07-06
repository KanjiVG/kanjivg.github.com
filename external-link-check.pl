#!/home/ben/software/install/bin/perl
use Z;
use WWW::LinkRot ':all';
my $links = get_links(["projects.html"]);
my $json = "$Bin/link-statuses.json";
check_links($links, out => $json);
html_report(in => $json, out => '/usr/local/www/data/kanjivg-links.html', nofiles => 1);
exit;


