import {CImage} from "./improvedapi/Core";
import React from "react";
import {Margin, WithChild} from "./improvedapi/Element";
import {Row} from "./improvedapi/Flex";
import {KeyboardArrowDown} from "@mui/icons-material";
import {Box, ClickAwayListener, Popper} from "@mui/material";
import {Surface} from "./improvedapi/Material";
import {primaryColor} from "./Colors";

export interface GetResponse {
    body: string
    code: number
}

function httpGetCallback(url: string, onDone: (response: GetResponse) => void) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            onDone({body: xmlHttp.responseText, code: xmlHttp.status});
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

export async function httpGet(url: string): Promise<GetResponse> {
    return new Promise(resolve => httpGetCallback(url, (response) => resolve(response)));
}

export function CrashyLogo({size, margin}: {size: number, margin? : Margin}){
    return <CImage alt={"Logo"} src={process.env.PUBLIC_URL + '/favicon.svg'} width={size} height={size} margin={margin}/>
}

export function MoreInfoButton(props: WithChild) {
    const [anchorEl, setAnchorEl] = React.useState<null | Element>(null);

    const handleClick = (event: Element) => {
        setAnchorEl(anchorEl ? null : event);
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <Row onClick={handleClick}>
                <KeyboardArrowDown style={{filter: "brightness(0.5)"}}/>
            </Row>
            <Popper open={open} anchorEl={anchorEl}>
                <Box>
                    <MoreInfoButtonSurface closePopup={() => setAnchorEl(null)}>
                        {props.children}
                    </MoreInfoButtonSurface>
                </Box>
            </Popper>
        </div>
    );
}

function MoreInfoButtonSurface({closePopup, children}: { closePopup: () => void } & WithChild) {
    return <Surface style={{border: `solid ${primaryColor} 1px`}}>
        <ClickAwayListener onClickAway={() => closePopup()}>
            <div>
                {children}
            </div>
        </ClickAwayListener>
    </Surface>

}
