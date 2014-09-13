#!/usr/bin/perl
#
# Copyright 2013 - Xavier Berger - http://rpi-experiences.blogspot.fr/
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
use File::Which;
use strict;

if(which('aptitude')) {
  open ( FILE, 'aptitude -F%p --disable-columns search ~U |') or die "$!\n";
} elsif (which('pacman')) {
  system ( 'pacman -Sy > /dev/null' );
  open ( FILE, 'pacman -Quq |' ) or die "$!\n";
} else {
  die "Error: neither pacman nor aptitude seem to be available\n";
}

my $pkgnbr = 0;
my $pkglist = "";
while (<FILE>){
  chomp;
  $pkglist = "$pkglist $_";+
  $pkgnbr++;
}
close (FILE);
open ( FILE, '> /var/lib/rpimonitor/updatestatus.txt' ) or die "$!\n";
  print FILE "$pkglist $pkgnbr upgradable(s)\n";
close (FILE);
