import {
    ForgeTraceMetadata,
    javaClassFullName,
    javaMethodFullNameName,
    javaMethodSimpleName,
    RichStackTrace,
    RichStackTraceElement,
    StackTraceMessage,
    unfoldRichStackTrace
} from "../model/RichCrashReport";
import {Column, Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {clickableColor, fadedOutColor, primaryColor} from "./App";
import React from "react";
import {Box, Button, ClickAwayListener, Divider, Grow, Popper, Typography} from "@mui/material";
import {Surface} from "./improvedapi/Material";
import {KeyboardArrowDown} from "@mui/icons-material";
import {WithChild} from "./improvedapi/Element";
import {Spacer} from "./improvedapi/Core";


export function StackTraceUi({stackTrace}: { stackTrace: RichStackTrace }) {
    const causerList = unfoldRichStackTrace(stackTrace);
    const [currentCauserIndex, setCauserIndex] = React.useState(0)
    const currentTrace = causerList[currentCauserIndex];

    return <Column alignSelf={"start"}>
        {CausationButtons(currentCauserIndex, causerList, setCauserIndex)}

        <Row flexWrap={"wrap"}>
            {StackTraceMessageUi(currentTrace.message)}
            <Text text={":"} variant="h5"/>
            <Spacer width={5}/>
            <Text style={{lineBreak: "anywhere"}} text={currentTrace.message.message}
                  variant={currentTrace.message.message.length > 200 ? "body1" : "h5"}/>
        </Row>

        <Divider/>
        {StackTraceElementsUi(currentTrace.elements)}
    </Column>
}

export function StackTraceElementsUi(elements: RichStackTraceElement[]) {
    return elements.map((traceElement, i) => <StackTraceElementUi key={i} traceElement={traceElement}/>)
}

function CausationButtons(currentCauserIndex: number, causerList: RichStackTrace[], onCauserIndexChanged: (index: number) => void) {
    return <Row>
        <span style={{paddingLeft: 5}}/>
        {currentCauserIndex > 0 && <CausationButton
            text={`Caused: ${causerList[currentCauserIndex - 1].message.class.simpleName}`}
            onClick={() => onCauserIndexChanged(currentCauserIndex - 1)}
        />}
        {currentCauserIndex > 0 && <span style={{paddingLeft: 20}}/>}
        {currentCauserIndex < causerList.length - 1 && <CausationButton
            text={`Caused By: ${causerList[currentCauserIndex + 1].message.class.simpleName}`}
            onClick={() => onCauserIndexChanged(currentCauserIndex + 1)}
        />}
    </Row>;
}

//todo: LOOK AT THIs
//color={clickableColor}
function CausationButton(props: { text: string, onClick: () => void }) {
    return <Button disableRipple={true} variant={"outlined"} size={"small"} onClick={props.onClick}>
        {props.text}
    </Button>
    // return <Surface margin={{right: 20}} padding={{horizontal: 7, vertical: 2}}
    //                 className={"hoverable"}
    //                 backgroundColor={"#353535"}
    //                 width={"max-content"}
    //                 >
    //     <Typography color={}>
    //
    //     </Typography>
    //     <Text  text= variant={"button"}/>
    // </Surface>
}

function StackTraceMessageUi(message: StackTraceMessage) {
    const [open, setOpen] = React.useState(false)
    // const className = open ? undefined : "glow"
    const style = open ? {} : {/*cursor: "pointer",*/ color: "rgb(0 173 239)"}

    const text = open ? javaClassFullName(message.class) : message.class.simpleName;

    return <Text style={style} text={text}
                 onClick={() => setOpen(!open)} variant={"h5"}/>
}

function StackTraceElementUi({traceElement}: { traceElement: RichStackTraceElement }) {
    const [open, setOpen] = React.useState(false)
    const text = getTraceElementText(traceElement, open)
    const isXMore = typeof traceElement === "number"

    return <Row margin={{left: 30}}>
        {/*TODO: look at colors here*/}
        {/*color={fadedOutColor}*/}
        {/* color={ undefined : clickableColor}*/}
        <Typography color={fadedOutColor} marginRight={"10px"}>
            at
        </Typography>
        {/*<Text text={""} variant={"caption"}  margin={{right: 10}}/>*/}
        <Text color={open || isXMore ? undefined : clickableColor} text={text} style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word"
        }} onClick={isXMore ? undefined : () => {
            setOpen(!open);
        }}/>
        {typeof traceElement !== "number" && traceElement.forgeMetadata && ForgeTraceMetadataUi(traceElement.forgeMetadata)}

    </Row>;
}

function getTraceElementText(traceElement: RichStackTraceElement, open: boolean): string {
    if (typeof traceElement === "number") return `${traceElement} more...`
    const isNativeMethod = traceElement.line.number === undefined;
    if (open) {
        const inBracketText = isNativeMethod ? "Native Method" : `${traceElement.line.file}:${traceElement.line.number}`
        return javaMethodFullNameName(traceElement.method) + ` (${inBracketText})`
    } else {
        const inBracketText = isNativeMethod ? "Native Method" : `Line ${traceElement.line.number}`
        return javaMethodSimpleName(traceElement.method) + ` (${inBracketText})`
    }
}

function ForgeTraceMetadataUi(metadata: ForgeTraceMetadata) {
    return <MoreInfoButton>

        <Column padding={10}>
            <Text text={"Forge Metadata"} variant={"h6"}/>
            {metadata.jarFile && <Text text={`File: ${metadata.jarFile}`}/>}
            {metadata.version && <Text text={`Version: ${metadata.version}`}/>}
            {metadata.pluginTransformerReasons.length > 0 && metadata.pluginTransformerReasons.map(reason =>
                <Text text={`Plugin Transformer Reason: ${reason}`}/>)}
            {metadata.classloadingReasons.length > 0 && metadata.classloadingReasons.map(reason => <Text
                text={`Class Loading Reason: ${reason}`}/>)}
            {metadata.additionalTransformerData.length > 0 && metadata.additionalTransformerData.map(reason =>
                <Text text={`Additional Transformer Data: ${reason}`}/>)}
        </Column>
    </MoreInfoButton>
}

export function MoreInfoButton(props: WithChild) {
    const [anchorEl, setAnchorEl] = React.useState<null | Element>(null);

    const handleClick = (event: Element) => {
        setAnchorEl(anchorEl ? null : event);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return (
        <div>
            <Row onClick={handleClick}>
                <KeyboardArrowDown style={{filter: "brightness(0.5)"}}/>
            </Row>
            <Popper id={id} open={open} anchorEl={anchorEl}>
                <MoreInfoButtonSurface setOpen={() => setAnchorEl(null)}>
                    {props.children}
                </MoreInfoButtonSurface>
            </Popper>
        </div>
    );
}

//        {/*<Popper open={open} anchorEl={anchorEl} transition>*/}
//         {/*    <Text text={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid amet architecto, aspernatur aut cupiditate, delectus deleniti deserunt dolorem doloremque dolorum eveniet ex expedita facilis fugit hic itaque iure nemo pariatur quam sit tenetur voluptas voluptate. Blanditiis earum neque omnis sint. Aspernatur distinctio ducimus enim fuga reprehenderit velit voluptatibus. Ab accusamus ad animi, earum enim id nam officia officiis quasi tempora! Ab alias aspernatur assumenda at blanditiis corporis cupiditate dolor, eligendi eos error eveniet impedit maiores, nesciunt placeat, porro provident qui recusandae repellendus repudiandae voluptas. Adipisci aut dolores minus nisi quibusdam sunt temporibus vitae voluptatibus. Ab ad assumenda cumque delectus distinctio dolores enim eos excepturi exercitationem facere illo illum, in incidunt ipsa itaque minus molestiae mollitia necessitatibus nihil nostrum numquam quaerat ratione recusandae repellat veritatis. Accusantium aliquam animi consequatur debitis dicta dolores dolorum eum eveniet excepturi incidunt, ipsam iste necessitatibus perspiciatis porro quam quia quo sint temporibus tenetur, unde vitae voluptatem voluptatibus? Accusamus aliquid aperiam consectetur culpa dolor, dolores, enim error eveniet, inventore nostrum numquam pariatur recusandae repellat saepe sapiente tenetur voluptate voluptatibus voluptatum? Accusantium aliquam deleniti eius eum maiores qui saepe soluta, voluptate? Animi cumque id magni quas? Aliquam corporis doloremque facilis id magni natus nostrum quas sunt voluptates."}/>*/}
//         {/*   /!*/!* //TODO: return grow*!/*!/*/}
//         {/*   /!* /!*{({TransitionProps}) => (*!/*!/*/}
//         {/*   /!* /!*    <Grow {...TransitionProps}>*!/*!/*/}
//         {/*   /!*         <MoreInfoButtonSurface setOpen={setOpen}>*!/*/}
//         {/*   /!*             {props.children}*!/*/}
//         {/*   /!*         </MoreInfoButtonSurface>*!/*/}
//         {/*    /!*    </Grow>*!/*/}
//         {/*    /!*)}*!/*/}
//         {/*</Popper>*/}
// export function MoreInfoButton(props: WithChild) {
//     // const [open, setOpen] = React.useState(false);
//     const [anchorEl, setAnchorEl] = React.useState<Element | null>(null)
//     const open = Boolean(anchorEl)
//
//     return SimplePopper()
//     // return /*<div>*/
//     //     {/*<Button ref={}/>*/}
//     //     {/*<Row onClick={}>*/}
//     //     {/*    <KeyboardArrowDown onClick={(event: React.MouseEvent) => {*/}
//     //     {/*        setAnchorEl(anchorEl ? null : event.currentTarget);*/}
//     //     {/*    }}*/}
//     //     {/*     style={{filter: "brightness(0.5)"}}/>*/}
//     //     {/*</Row>*/}
//     //     <SimplePopper/>
//     //
//     // </div>
// }

function MoreInfoButtonSurface({setOpen, children}: { setOpen: (open: boolean) => void } & WithChild) {
    // const ref = React.useRef<HTMLDivElement>(null);
    // useEffect(() => {
    //     /**
    //      * Alert if clicked on outside of element
    //      */
    //     function handleClickOutside(event: { target: any; }) {
    //         if (ref.current && !ref.current!.contains(event.target)) {
    //             setOpen(false)
    //         }
    //     }
    //
    //     // Bind the event listener
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         // Unbind the event listener on clean up
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // },[ref,setOpen]);


    return <Surface style = {{border: `solid ${primaryColor} 1px`}}>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div>
                {children}
            </div>
        </ClickAwayListener>
    </Surface>

}
