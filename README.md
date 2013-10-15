Css2LessAgain
=============

Convert css to less with variable names based on selectors.<br />
Enhanced the code from <a href="http://www.miyconst.com/Blog/View/14/Conver_css_to_less_with_css2less_js">http://www.miyconst.com/Blog/View/14/Conver_css_to_less_with_css2less_js</a>

This version creates varable names from the css selectors:

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
