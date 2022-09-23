package io.github.crashy.plugins

import io.ktor.server.plugins.*
import io.ktor.server.http.content.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cachingheaders.*
import io.ktor.server.plugins.defaultheaders.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import java.time.ZonedDateTime

//TODO: learn more about what cache policies we should use https://web.dev/uses-long-cache-ttl/?utm_source=lighthouse&utm_medium=devtools
//TODO: serve using https
//TODO: after a few days try to see metrics on ec2 pricing: are we paying 24/7?
//TODO: what can we do to reduce cost?
fun Application.configureHTTP() {
    install(CachingHeaders) {
        options { call, outgoingContent ->
            when (outgoingContent.contentType?.withoutParameters()) {
                ContentType.Text.CSS -> CachingOptions(
                    CacheControl.MaxAge(maxAgeSeconds = 24 * 60 * 60),
                    ZonedDateTime.now().plusWeeks(1)
                )
                else -> null
            }
        }
    }
//    install(Compression) {
//        gzip {
//            priority = 1.0
//        }
//        deflate {
//            priority = 10.0
//            minimumSize(1024) // condition
//        }
//    }
//    install(ConditionalHeaders)
//    install(CORS) {
//        method(HttpMethod.Options)
//        method(HttpMethod.Put)
//        method(HttpMethod.Delete)
//        method(HttpMethod.Patch)
//        header(HttpHeaders.Authorization)
//        header("MyCustomHeader")
//        anyHost()@ // TODO: Don't do this in production if possible. Try to limit it.
//    }
    install(DefaultHeaders) {
        header("X-Engine", "Ktor") // will send this header with each response
    }
//    install(HttpsRedirect) {
//            // The port to redirect to. By default 443, the default HTTPS port.
//            sslPort = 443
//            // 301 Moved Permanently, or 302 Found redirect.
//            permanentRedirect = true
//        }

}
