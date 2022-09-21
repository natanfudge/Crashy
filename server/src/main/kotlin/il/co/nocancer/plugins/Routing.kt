package il.co.nocancer.plugins

import il.co.nocancer.runDir
import il.co.nocancer.staticDir
import il.co.nocancer.staticPath
import io.ktor.server.routing.*
import io.ktor.http.*
import io.ktor.server.plugins.*
import io.ktor.server.locations.*
import io.ktor.server.http.content.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import java.io.File

fun Application.configureRouting() {
//    install(AutoHeadResponse)
//    install(Locations) {
//    }


    routing {
//        get("/") {
//            call.respond(Application::class.java.getResource("/static/index.html").readText())
////            call.respondText("Hello World!")
//        }
//        get<MyLocation> {
//                call.respondText("Location: name=${it.name}, arg1=${it.arg1}, arg2=${it.arg2}")
//            }
//            // Register nested routes
//            get<Type.Edit> {
//                call.respondText("Inside $it")
//            }
//            get<Type.List> {
//                call.respondText("Inside $it")
//            }
        // Static plugin. Try to access `/static/index.html`
        static("/") {
            preCompressed {
                staticRootFolder = staticDir.toFile()
                files(".")
                default("index.html")
            }

//            default("index.html")
        }
//        install(StatusPages) {
//            exception<AuthenticationException> { call, cause ->
//                call.respond(HttpStatusCode.Unauthorized)
//            }
//            exception<AuthorizationException> { call, cause ->
//                call.respond(HttpStatusCode.Forbidden)
//            }
//
//        }
    }
}

@Location("/location/{name}")
class MyLocation(val name: String, val arg1: Int = 42, val arg2: String = "default")
@Location("/type/{name}")
data class Type(val name: String) {
    @Location("/edit")
    data class Edit(val type: Type)

    @Location("/list/{page}")
    data class List(val type: Type, val page: Int)
}

class AuthenticationException : RuntimeException()
class AuthorizationException : RuntimeException()
