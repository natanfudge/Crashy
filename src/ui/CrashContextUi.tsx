import {Column, Row} from "./utils/improvedapi/Flex";
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
import {CDivider, CImage} from "./utils/improvedapi/Core";
import {Text} from "./utils/improvedapi/Text";
import {lightBlue} from "@mui/material/colors";
import {CrashContext, LoaderType, OperatingSystemType} from "../../parser/src/model/RichCrashReport";
import {Surface} from "./utils/improvedapi/Material";

export function CrashContextUi({context}: { context: CrashContext }) {
    const loaderName = context.loader.type === LoaderType.Fabric ? "Fabric Loader " : "Forge ";
    const displayedTime = formatTime(context.time);
    const isForge = context.loader.type === LoaderType.Forge

    return <Surface height="fit-content" width="fit-content" padding={{top: 16, left: 16, right: 16, bottom: 24}}>
        <Column>
            <CrashContextElement color={"#1cc11e"} image={MinecraftLogo} text={context.minecraftVersion}/>
            <CrashContextElement color={"#ffe500"}
                                 filter={isForge ? "invert(79%) sepia(6%) saturate(187%) hue-rotate(335deg) brightness(83%) contrast(93%)" : undefined}
                                 image={isForge ? ForgeLogo : FabricLogo}
                                 text={loaderName + context.loader.version}/>
            <CrashContextElement color={"#ef8928"} image={JavaLogo} text={context.javaVersion}/>
            <CrashContextElement color={lightBlue[100]} image={getOperatingSystemIcon(context.operatingSystem.type)}
                                 text={context.operatingSystem.name}/>
            <CrashContextElement color={"#CC9966"} image={ClockIcon} text={displayedTime}/>
        </Column>
    </Surface>
}


function CrashContextElement(props: { image: string, text: string, color: string, filter?: string }) {
    return <Row padding={{vertical: 5}} margin={{top: 10}}>
        <CDivider height={"auto"} width={2} backgroundColor={props.color} margin={{right: 10}}/>
        <CImage src={props.image} margin={{right: 10}} width={30} height={30} alt="Icon"
                style={{filter: props.filter}}/>
        <Text style = {{maxWidth: "15rem"}} text={props.text} variant="h6"/>
    </Row>

}

function formatTime(time: Date) {
    const hour = time.getHours();
    const minutes = time.getMinutes() > 10 ? time.getMinutes().toString() : `0${time.getMinutes()}`
    return `${time.getDate()}/${time.getMonth()}/${time.getFullYear() - 2000} ${hour}:${minutes}`;
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