package io.github.crashy

import io.github.crashy.utils.replaceSequentially
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import kotlin.test.Test

class ReplaceSequentially {
    @Test
    fun testReplacement(){
        val result = testTemplate.replaceSequentially(
            listOf("{ID}" to "12345","{DESCRIPTION}" to "Amar the Great", "{TITLE}" to "Amazing Title")
        )

        expectThat(result).isEqualTo(expectedResult)
    }
}

private const val testTemplate = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!--We always use this domain so preconnect to it. See https://web.dev/uses-rel-preconnect-->
    <link rel="prefetch" href="%PUBLIC_URL%/{ID}/raw">
    <link rel="icon" href="%PUBLIC_URL%/favicon.svg" />
    <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<!--    <meta name="viewport" content="width=1920; user-scalable=0;" />-->

    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="{DESCRIPTION}"
    />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link href = "%PUBLIC_URL%/raw"/>
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>{TITLE}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>
"""

private const val expectedResult = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!--We always use this domain so preconnect to it. See https://web.dev/uses-rel-preconnect-->
    <link rel="prefetch" href="%PUBLIC_URL%/12345/raw">
    <link rel="icon" href="%PUBLIC_URL%/favicon.svg" />
    <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<!--    <meta name="viewport" content="width=1920; user-scalable=0;" />-->

    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Amar the Great"
    />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link href = "%PUBLIC_URL%/raw"/>
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>Amazing Title</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>
"""
