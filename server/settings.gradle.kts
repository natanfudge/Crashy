pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}
plugins {
    id ("de.fayard.refreshVersions") version "0.51.0"
}
rootProject.name = "Crashy"
refreshVersions {
    rejectVersionIf {
        candidate.stabilityLevel.isLessStableThan(current.stabilityLevel)
    }
}