import React, {CSSProperties} from 'react';
import './App.css';
import {
    AppBar,
    Card,
    Container,
    createTheme,
    CssBaseline,
    Grow,
    MuiThemeProvider,
    Popper,
    Typography
} from "@material-ui/core";
import {red} from "@material-ui/core/colors";
import {CButton, Center, Column, Text} from "./ImprovedApi";

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
            text: "java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)",
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

            <AppBar color="inherit">
                <Typography align={"center"} variant="h3">Minecraft Crash Report</Typography>
            </AppBar>

            <div style={{marginTop: 70}}>
                {/*<Grid container direction="row" style = {{marginTop: 70}}>*/}
                {/*    /!*<Text text = "  asdf"/>*!/*/}
                {/*    /!*<Text text = "   addddloha"/>*!/*/}
                {/*    <Grid item>*/}
                <Column style={{position: "absolute"}}>
                    {/*todo make the time be above the other stuff on mobile*/}
                    <Card style={{marginLeft: 10, width: "max-content"}}>
                        <Text text="7/19/21 8:03 PM" variant="h6" style={{padding: 10}}/>
                    </Card>
                    {/*TODO: make the sections use a sidebar on mobile*/}

                    {/*</Grid>*/}
                    {/*<Grid item  xs style = {{position:"absolute"}}>*/}
                </Column>

                <Center>

                    <Container>
                        <Center>
                            <Card style={{width: "max-content", margin: 10, paddingLeft: 20, paddingRight: 20,}}>
                                <Text text="charTyped event handler" variant="h6" style={{padding: 10}}
                                      align={"center"}/>
                            </Card>
                        </Center>

                        <Text text="Why did you do that?" align={"center"}/>
                        <StackTraceUi trace={stackTrace}/>
                        <Center>
                            <Section/>
                        </Center>

                    </Container>

                </Center>
            </div>


        </MuiThemeProvider>


    )
}


function StackTraceUi({trace, depth = 0}: { trace: StackTrace, depth?: number }) {
    const [open, setOpen] = React.useState(false);
    return (
        <Column>
            <CButton onClick={() => setOpen(!open)} style={{
                marginLeft: depth * 30,
                marginTop: 5,
                marginBottom: 5,
                marginRight: 5
            }}>
                <Text text={trace.text} style={{whiteSpace: "pre-wrap", wordBreak: "break-word", minWidth: 500}}/>
            </CButton>

            {/*When opened, display the child dropdowns*/}
            {open && trace.children.map((child, index) =>
                <StackTraceUi key={index} depth={depth + 1} trace={child}/>
            )}
        </Column>
    )
}

function Section() {
    const [open, setOpen] = React.useState(false);
    return (
        <div style={{padding: 10}}>
            <CButton onClick={() => setOpen(!open)}
                     style={{width: 'max-content', padding: 20}}
                     popper={
                         <Popper open={open} placement={"right-start"} transition>
                             {({TransitionProps}) => (
                                 <Grow {...TransitionProps}>
                                     <CButton onClick={() => setOpen(!open)}
                                              style={{minWidth: 400, maxWidth: 500, margin: 10}}>
                                         <Text style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}}
                                               text="All players: 2 total; [class_746['Kana_Pei'/14604, l='ClientLevel', x=834.50,
                                     y=59.00,
                                     z=-348.50],
                                     class_745['Alex'/2164, l='ClientLevel', x=864.45, y=63.00, z=-301.68]]"/>
                                     </CButton>
                                 </Grow>
                             )}

                         </Popper>
                     }>

                <Text text="Affected World"/>
            </CButton>

        </div>
    )
}

interface StackTrace {
    text: String
    children: StackTrace[]
}


export default App;
