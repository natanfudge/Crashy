package io.github.crashy.auth

import io.github.crashy.Crashy
import io.github.crashy.UserSession
import io.github.crashy.routing.Routes
import io.github.crashy.utils.getResource
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.html.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import kotlinx.html.*

private const val UserSessionName = "user_session"
const val AuthSessionName = "auth-session"
private const val AuthFormName = "auth-form"
private const val AuthUsernameField = "username"
private const val AuthPasswordField = "password"
private val adminUsername = getResource("/secrets/admin_user.txt")
private val adminPassword = getResource("/secrets/admin_pass.txt")

private const val LoginPath = "/login"

fun Application.installAuthentication() {
    install(Sessions) {
        cookie<UserSession>(UserSessionName) {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 6000
        }
    }
    install(Authentication) {
        form(AuthFormName) {
            userParamName = AuthUsernameField
            passwordParamName = AuthPasswordField
            validate { credentials ->
                if (credentials.name == adminUsername && credentials.password == adminPassword) {
                    UserIdPrincipal(credentials.name)
                } else {
                    null
                }
            }
            challenge(LoginPath)
        }

        session<UserSession>(AuthSessionName) {
            validate { session ->
                session
            }
            challenge {
                call.respondRedirect(LoginPath)
            }
        }
    }
}

fun Routing.routeAuthentication(){
    get(LoginPath) {
        call.respondHtml {
            body {
                form(action = LoginPath, encType = FormEncType.applicationXWwwFormUrlEncoded, method = FormMethod.post) {
                    p {
                        +"Username:"
                        textInput(name = AuthUsernameField)
                    }
                    p {
                        +"Password:"
                        passwordInput(name = AuthPasswordField)
                    }
                    p {
                        submitInput { value = "Login" }
                    }
                }
            }
        }
    }

    authenticate(AuthFormName) {
        post(LoginPath) {
            val userName = call.principal<UserIdPrincipal>()?.name.toString()
            call.sessions.set(UserSession(name = userName, count = 1))
            call.respondRedirect(Routes.Logs)
        }
    }
}