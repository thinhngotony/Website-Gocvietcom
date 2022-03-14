=== WP-Quick-Pages===
Contributors: georgemandis
Donate link: http://snaptortoise.com
Tags: page, admin
Requires at least: 2.0.2
Tested up to: 3.4
Stable tag: 1.0
Author URI: http://snaptortoise.com

License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Generate blank pages with hierarchies really, really fast.

== Description ==

WordPress plugin that lets you quickly create blank pages with hierarchies. Useful if you use WordPress as a CMS for simple sites that make use of pages.

This plugin will add a submenu item called "WP Quick Pages" underneath "Pages" section of your admin area. On this age you can quickly enter pages, one per line, like this:

	About the Plugin
	FAQ
	Links
	Examples
	Contact

When you're finished click the Create these pages button. You will find blank, published pages with these titles now show up in your Pages section.

The cool part is you can quickly show hierarchies as well:

	About the Plugin
	- Donate
	- Open Source
	-- Github
	-- Help Develop
	FAQ
	Links
	Examples
	- Example one
	-Example two
	Contact

The example is probably pretty obvious, but the parent of the page is dictated by the number of hyphens in front of the title.  Assuming you have pretty permalinks enabled, the URL for the "Help Develop" page above would look like:

http://example.com/about-the-plugin/open-source/help-develop

If you find yourself working on sites where the structure gets decided upon before the content is necessarily ready (ahem) then you may find this useful.

== Installation ==

1. Upload the `wp-quick-pages` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. When you feel like using WP-Quick-Pages go to where it says 'WP-Quick-Pages' underneath the Pages section in the admin area.

== Frequently Asked Questions ==

None at the moment.

== Screenshots ==

None at the moment.

== Upgrade Notice ==

Nothing to report.

== Changelog ==

= 1.0 =
* Initial commit. Does exactly what it says on the can

== Feature Requests ==

Please consider making feature requests at the [GitHub page](https://github.com/snaptortoise/wp-quick-pages) or [contact me directly](http://snaptortoise.com).

