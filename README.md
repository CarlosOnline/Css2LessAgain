Css2LessAgain
=============

Convert css to less with variable names based on selectors.<br />
WebSite: <a href="http://www.joyofplaying.com/Css2Less/">http://www.joyofplaying.com/Css2Less/</a>


This version creates varable names from the css selectors:<br />
1. Uses your selectors for variables names<br />
2. Allows you to specify which selectors to turn into variables<br />
3. Fixes bug processing multi-line comments<br />

Before
-------
.ui-widget { font-family: Verdana,Arial,sans-serif/*{ffDefault}*/; font-size: 1.1em/*{fsDefault}*/; }
.ui-widget .ui-widget { font-size: 1em; }


After
-----
@ui-widget-font-size: 1.1em;
@ui-widget-ui-combined-widget-font-size: 1em;

.ui-widget
{
   font-family:Verdana,Arial,sans-serif;
   font-size:@ui-widget-font-size;

   .ui-widget
   {
       font-size:@ui-widget-ui-combined-widget-font-size;
   }
}

This is an enhanced version of the code from <a href="http://www.miyconst.com/Blog/View/14/Conver_css_to_less_with_css2less_js">http://www.miyconst.com/Blog/View/14/Conver_css_to_less_with_css2less_js</a>
