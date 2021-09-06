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
import {CDivider, Image} from "./improvedapi/Core";
import {Text} from "./improvedapi/Text";
import {Card, CardContent, Divider} from "@mui/material";
import {blue, lightBlue, red, yellow} from "@mui/material/colors";

export function CrashContextUi(context: CrashContext) {
    const loaderName = context.loader.type === LoaderType.Fabric ? "Fabric Loader " : "Forge ";
    const displayedTime = formatTime(context.time);

    return <Card sx = {{height: "fit-content"}}>
        <CardContent>
            <Column>
                <CrashContextElement color = {"#1cc11e"} image={MinecraftLogo} text={context.minecraftVersion}/>
                <CrashContextElement color = {"#ffe500"} image={context.loader.type === LoaderType.Forge ? ForgeLogo : FabricLogo}
                                     text={loaderName + context.loader.version}/>
                <CrashContextElement color = {"#ef8928"} image={JavaLogo} text={context.javaVersion}/>
                <CrashContextElement color = {lightBlue[100]} image={getOperatingSystemIcon(context.operatingSystem.type)}
                                     text={context.operatingSystem.name}/>
                <CrashContextElement color={"#CC9966"} image={ClockIcon} text={displayedTime}/>
            </Column>
        </CardContent>
    </Card>
    // <Row>
    //
    //     <CDivider width={1} height="auto"/>
    // </Row>
}

function CrashContextElement(props: { image: string, text: string, color: string }) {
    return <Row padding={{vertical: 5}} margin={{top: 10}}>
        {/*<Divider color={}*/}
        <CDivider height={"auto"} width={2} backgroundColor={props.color} margin={{right: 10}}/>
        <Image src={props.image} margin={{right: 10}} height={30} alt="Icon"/>
        <Text text={props.text} variant="h6"/>
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