import MinecraftLogo from "../../../media/minecraft_cube.svg";
import ForgeLogo from "../../../media/forge_logo.svg";
import FabricLogo from "../../../media/fabric_logo.svg";
import JavaLogo from "../../../media/java-icon.svg";
import ClockIcon from "../../../media/clock_white.svg";
import React from "react";
import WindowsLogo from "../../../media/windows_logo.svg";
import LinuxLogo from "../../../media/linux_logo.svg";
import MacosLogo from "../../../media/macos_logo.svg";
import QuestionMarkIcon from "../../../media/questionmark_icon_white.svg";
import {lightBlue} from "@mui/material/colors";
import {fadedOutColor} from "../../Colors";
import {Link} from "@mui/material";
import {CrashyNewIssueUrl} from "../../utils/Crashy";
import {Text, TextTheme} from "../../../fudge-commons/simple/Text";
import {
    CrashContext,
    getLoaderLogo,
    getLoaderName,
    LoaderType,
    OperatingSystemType
} from "../../../crash/model/RichCrashReport";
import {SimpleDivider} from "../../../fudge-commons/simple/SimpleDivider";
import {Column, Row} from "../../../fudge-commons/simple/Flex";
import {Spacer} from "../../../fudge-commons/simple/SimpleDiv";
import {SimpleImage} from "../../../fudge-commons/simple/SimpleImage";
import {Surface} from "../../../fudge-commons/simple/Surface";


export function CrashLeftSide(props: { context: CrashContext }) {
    return <Column height={"max"}>
        <CrashContextUi context={props.context}/>
        <Spacer flexGrow={1}/>
        <TextTheme maxWidth="fit-content" color={fadedOutColor} padding={{bottom: 70, left: 20, right: 10}}>
            Something looks wrong? <br/><Link href={CrashyNewIssueUrl}>Report an issue</Link>
        </TextTheme>
    </Column>
}

export function CrashContextUi({context}: { context: CrashContext }) {
    const loaderName = getLoaderName(context.loader.type)
    const displayedTime = formatTime(context.time);
    const isForge = context.loader.type === LoaderType.Forge

    return <Surface height="fit-content" width="max-content" padding={{top: 16, left: 16, right: 16, bottom: 24}}>
        <Column>
            {context.minecraftVersion !== undefined && <CrashContextElement color={"#1cc11e"} image={MinecraftLogo} text={context.minecraftVersion}/>}
            {context.loader.type !== LoaderType.Vanilla && <CrashContextElement color={"#ffe500"}
                                                                                filter={isForge ? "invert(79%) sepia(6%) saturate(187%) hue-rotate(335deg) brightness(83%) contrast(93%)" : undefined}
                                                                                image={getLoaderLogo(context.loader.type)}
                                                                                text={loaderName + " " + (context.loader.version !== undefined ? context.loader.version : "")}/>}
            {context.javaVersion !== undefined && <CrashContextElement color={"#ef8928"} image={JavaLogo} text={"Java " + context.javaVersion}/>}
            {context.operatingSystem !== undefined && <CrashContextElement color={lightBlue[100]} image={getOperatingSystemIcon(context.operatingSystem.type)}
                                  text={context.operatingSystem.name}/>}
            <CrashContextElement color={"#CC9966"} image={ClockIcon} text={displayedTime}/>

        </Column>
    </Surface>
}


function CrashContextElement(props: { image: string, text: string, color: string, filter?: string }) {
    return <Row padding={{vertical: 5}} margin={{top: 10}}>
        <SimpleDivider height={"auto"} width={2} backgroundColor={props.color} margin={{right: 10}}/>
        <SimpleImage src={props.image} margin={{right: 10}} width={30} height={30} alt="Icon"
                     style={{filter: props.filter}}/>
        <Text maxWidth={240} text={props.text} variant="h6"/>
    </Row>

}

function formatTime(time: Date) {
    const hour = time.getHours();
    const minutes = time.getMinutes() >= 10 ? time.getMinutes().toString() : `0${time.getMinutes()}`
    // Javascript Date month is 0-indexed
    return `${twoCharacters(time.getDate())}/${twoCharacters(time.getMonth() + 1)}/${time.getFullYear() - 2000} ${twoCharacters(hour)}:${twoCharactersStr(minutes)}`;
}

function twoCharacters(num: number): string {
    const str = String(num)
    return twoCharactersStr(str)
}
function twoCharactersStr(str: string): string {
    if (str.length < 2) return `0${str}`
    else return str
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