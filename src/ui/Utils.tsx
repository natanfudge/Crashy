import {CImage} from "./improvedapi/Core";
import React from "react";
import {ClickCallback, Margin, Padding, SingleChildParentProps, WithChild} from "./improvedapi/Element";
import {KeyboardArrowDown} from "@mui/icons-material";
import {Box, ClickAwayListener, Popper} from "@mui/material";
import {CIconButton, Surface} from "./improvedapi/Material";
import {primaryColor} from "./Colors";

export interface GetResponse {
    body: string
    code: number
}

function httpCallCallback(url: string,method: string, body: string | null, onDone: (response: GetResponse) => void) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            onDone({body: xmlHttp.responseText, code: xmlHttp.status});
        }
    }
    xmlHttp.open(method, url, true); // true for asynchronous
    xmlHttp.send(body);
}

// function httpGetCallback(url: string, onDone: (response: GetResponse) => void) {
//     const xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function () {
//         if (xmlHttp.readyState === 4) {
//             onDone({body: xmlHttp.responseText, code: xmlHttp.status});
//         }
//     }
//     xmlHttp.open("GET", url, true); // true for asynchronous
//     xmlHttp.send(null);
// }

export async function httpGet(url: string): Promise<GetResponse> {
    return new Promise(resolve => httpCallCallback(url, "GET",null,(response) => resolve(response)));
}

export async function httpDelete(url: string): Promise<GetResponse> {
    return new Promise(resolve => httpCallCallback(url, "DELETE",null,(response) => resolve(response)));
}

export function CrashyLogo({size, margin}: { size: number, margin?: Margin }) {
    return <CImage alt={"Logo"} src={process.env.PUBLIC_URL + '/favicon.svg'} width={size} height={size}
                   margin={margin}/>
}


export function MoreInfoButton(props: WithChild) {
    return <ExpandingButton buttonPadding={0} icon={<KeyboardArrowDown style={{filter: "brightness(0.5)"}}/>}>
        {props.children}
    </ExpandingButton>
    // const [anchorEl, setAnchorEl] = React.useState<Element | undefined>(undefined);
    //
    // const handleClick: ClickCallback = (event: Element) => {
    //     setAnchorEl(anchorEl ? undefined : event);
    // };
    //
    // return <div>
    //     <Row onClick={handleClick}>
    //         <KeyboardArrowDown/>
    //     </Row>
    //     <Expansion anchorEl = {anchorEl} setAnchorEl = {setAnchorEl}>
    //         {props.children}
    //     </Expansion>
    // </div>
}


export function ExpandingButton({buttonPadding, icon, ...expansionProps}:
                                    { buttonPadding?: Padding, icon: JSX.Element } & SingleChildParentProps) {
    const [anchorEl, setAnchorEl] = React.useState<Element | undefined>(undefined);

    const handleClick: ClickCallback = (event: Element) => {
        setAnchorEl(anchorEl ? undefined : event);
    };

    // noinspection RequiredAttributes
    return <div>
        <CIconButton padding={buttonPadding} onClick={handleClick}>
            {icon}
        </CIconButton>
        <Expansion {...expansionProps} anchorEl={anchorEl} setAnchorEl={setAnchorEl}/>
    </div>
}

export function Expansion({anchorEl, setAnchorEl, ...surfaceProps}: {
    anchorEl: Element | undefined, setAnchorEl: (el: Element | undefined) => void
} & SingleChildParentProps): JSX.Element {
    const open = Boolean(anchorEl);

    // noinspection RequiredAttributes
    return <Popper open={open} anchorEl={anchorEl}>
        <Box>
            <ExpansionSurface {...surfaceProps} closePopup={() => setAnchorEl(undefined)}/>
        </Box>
    </Popper>
}

function ExpansionSurface({closePopup, children, ...otherProps}: { closePopup: () => void } & SingleChildParentProps) {
    return <Surface style={{border: `solid ${primaryColor} 1px`}} {...otherProps}>
        <ClickAwayListener onClickAway={() => closePopup()}>
            <div>
                {children}
            </div>
        </ClickAwayListener>
    </Surface>

}
