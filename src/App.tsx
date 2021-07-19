import React, {CSSProperties} from 'react';
import logo from './logo.svg';
import './App.css';
import {
    AppBar,
    Box,
    Button, Card, CardContent,
    Checkbox, ClickAwayListener,
    Container, createStyles,
    createTheme,
    CssBaseline, Grow, List, makeStyles, Menu, MenuItem, MenuList,
    MuiThemeProvider, Paper, Popper, Theme,
    Typography
} from "@material-ui/core";
import {orange, red} from "@material-ui/core/colors";
import {CommonProps} from "@material-ui/core/OverridableComponent";

const stackTrace: StackTrace = {
    text: "java.lang.StackOverflowError: charTyped event handler",
    children: [
        {
            text: "java.util.stream.AbstractPipeline.wrapSink(AbstractPipeline.java:522)",
            children: []
        },
        {
            text: "java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:474)",
            children: []
        },
        {
            text: "java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)",
            children: []
        },
        {
            text: "java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)",
            children: []
        }
    ]
}

function App() {
    const outerTheme = createTheme({
        palette: {
            type: 'dark',
            secondary: {
                main: red[500],
            },
        },
    });

    return (
        // @ts-ignore
        <MuiThemeProvider theme={outerTheme}>
            <CssBaseline/>

            <Card style={{marginTop: 70, marginLeft: 10, width: "max-content"}}>
                <Typography variant="h6" style={{padding: 10}}>
                    7/19/21 8:03 PM
                </Typography>
            </Card>
            <Box style={{display: "flex", justifyContent: "center"}}>
                <Card style={{width: "max-content", margin: 10, paddingLeft: 20, paddingRight: 20}}>
                    <Typography variant="h6" style={{padding: 10}} align={"center"}>
                        charTyped event handler
                    </Typography>
                </Card>
            </Box>

            <Container>
                <Typography align={"center"}>
                    Why did you do that?
                </Typography>

                <Dropdown trace={stackTrace}/>

                <AppBar color="inherit">
                    <Typography align={"center"} variant="h3">Minecraft Crash Report</Typography>
                </AppBar>

            </Container>
            <Section/>
        </MuiThemeProvider>


    )
}

interface StyleProp {
    style?: CSSProperties
}

interface HasChildren {
    children: React.ReactNode
}

function Dropdown({trace, depth = 0}: { trace: StackTrace, depth?: number }) {
    const [open, setOpen] = React.useState(false);
    return (
        <div>
            <div style={{
                marginLeft: depth * 30,
                marginTop: 5,
                marginBottom: 5
            }} onClick={() => setOpen(!open)}>
                <NiceButton>
                    {trace.text}
                </NiceButton>
            </div>

            {open && trace.children.map((child) =>
                <Dropdown depth={depth + 1} trace={child}/>
            )}
        </div>
    )
}

function NiceButton(props: { ref?: React.Ref<unknown> } & StyleProp & HasChildren) {
    return <Paper ref={props.ref} style={props.style}>
        <MenuItem style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}}>
            {props.children}
        </MenuItem>
    </Paper>
}


function Section() {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    return (
        <div style = {{padding: 10}}>
            {!open && <Box onClick={() => setOpen(!open)} style={{width: "max-content"}}>
                <Paper ref={anchorRef}>
                    <MenuItem style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}}>
                        Affected World
                    </MenuItem>
                </Paper>
            </Box>}


            {open && <Paper style = {{width: "80%",}} onClick={() => setOpen(!open)}>
                <MenuItem style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}} >
                    ll players: 2 total; [class_746['Kana_Pei'/14604, l='ClientLevel', x=834.50, y=59.00, z=-348.50],
                    class_745['Alex'/2164, l='ClientLevel', x=864.45, y=63.00, z=-301.68]]
                </MenuItem>
            </Paper>}


        </div>
    )
}

interface StackTrace {
    text: String
    children: StackTrace[]
}


export default App;
