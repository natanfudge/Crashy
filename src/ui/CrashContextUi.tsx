import {CrashContext, LoaderType, OperatingSystemType} from "../model/RichCrashReport";
import {Column, Row} from "./improvedapi/Flex";
import MinecraftLogo from "../media/minecraft_cube.svg";
import ForgeLogo from "../media/forge_logo.svg";
import FabricLogo from "../media/fabric_logo.svg";
import JavaLogo from "../media/java-icon.svg";
import ClockIcon from "../media/clock_white.svg";
import React from "react";
import WindowsLogo from "../media/windows_logo.svg";
import LinuxLogo from "../media/linux_logo.svg";
import MacosLogo from "../media/macos_logo.svg";
import QuestionMarkIcon from "../media/questionmark_icon_white.svg";
import {Surface} from "./improvedapi/Material";
import {slightlyPronouncedColor} from "./App";
import {CDivider, Image} from "./improvedapi/Core";
import {Text} from "./improvedapi/Text";
import {Divider} from "@material-ui/core";

export function CrashContextUi(context: CrashContext) {
    const loaderName = context.loader.type === LoaderType.Fabric ? "Fabric Loader " : "Forge ";
    const displayedTime = formatTime(context.time);

    return <Row>
        <Column margin={{left: 10}}>
            <CrashContextElement image={MinecraftLogo} text={context.minecraftVersion}/>
            <CrashContextElement image={context.loader.type === LoaderType.Forge ? ForgeLogo : FabricLogo}
                                 text={loaderName + context.loader.version}/>
            <CrashContextElement image={JavaLogo} text={context.javaVersion}/>
            <CrashContextElement image={getOperatingSystemIcon(context.operatingSystem.type)}
                                 text={context.operatingSystem.name}/>
            <CrashContextElement image={ClockIcon} text={displayedTime}/>
        </Column>
        <CDivider width = {1} height = "auto"/>
    </Row>
}

function CrashContextElement(props: { image: string, text: string }) {
     /*<Surface margin={{top: 10}} backgroundColor={slightlyPronouncedColor}>*/
    return <Row padding={{vertical: 5, horizontal: 10}} margin= {{top: 10}}>
            <Image src={props.image} margin={{right: 10}} height={30} alt="Icon"/>
            <Text text={props.text} variant="h6"/>
        </Row>
    // </Surface>
}

function formatTime(time: Date) {
    const isPm = time.getHours() > 12
    const hour = isPm ? (time.getHours() - 12) : time.getHours();
    const suffix = isPm ? "PM" : "AM"
    const minutes = time.getMinutes() > 10 ? time.getMinutes().toString() : `0${time.getMinutes()}`
    return `${time.getDate()}/${time.getMonth()}/${time.getFullYear() - 2000} ${hour}:${minutes} ${suffix}`;
}

function getOperatingSystemIcon(operatingSystem: OperatingSystemType): string {
    switch (operatingSystem) {
        case OperatingSystemType.Windows:
            return WindowsLogo;
        case OperatingSystemType.Linux:
            return LinuxLogo;
        case OperatingSystemType.Macos:
            return MacosLogo;
        case OperatingSystemType.Unknown:
            return QuestionMarkIcon
    }
}