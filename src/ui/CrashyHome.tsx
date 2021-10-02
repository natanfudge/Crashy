import React, {Fragment} from "react";
import {Surface} from "./utils/improvedapi/Material";
import {Column, Row} from "./utils/improvedapi/Flex";
import {Button, CircularProgress, Dialog, DialogContent, DialogTitle, Link, TextField} from "@mui/material";
import {Wrap} from "./utils/improvedapi/Core";
import {CloudUpload} from "@mui/icons-material";
import {Text, TextTheme} from "./utils/improvedapi/Text";
import {crashyTitleColor, dialogBodyColor} from "./Colors";
import {CrashyServer, UploadCrashError, UploadCrashResponse} from "./CrashyServer";
import pako from "pako";
import {CrashyLogo} from "./utils/Crashy";
import {goToUploadedCrash} from "./utils/PageUrl";

enum InitialUploadState {
    Start,
    Loading,
}

export default function CrashyHome() {
    const [log, setLog] = React.useState("");
    const [uploadState, setUploadState] = React.useState<UploadState>(InitialUploadState.Start)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const isLoading = uploadState === InitialUploadState.Loading

    return <div style={{height: "100%", width: "100%"}}>
        <Surface height={"max"}>
            <Column padding={{bottom: 20}} alignItems={"center"} height={"max"} style={{}}>
                <HomeTitle/>

                <CrashTextField error={isUploadCrashError(uploadState)} log={log} setLog={setLog}/>

                <Button onClick={async () => {
                    setUploadState(InitialUploadState.Loading)
                    const response = await CrashyServer.uploadCrash(pako.gzip(log));
                    if (isUploadCrashError(response)) {
                        setUploadState(response);
                        setDialogOpen(true);
                    } else {
                        goToUploadedCrash({id: response.crashId, code: response.key})
                    }
                }}
                        disabled={log === ""} size={"large"} variant={"contained"} color="primary" startIcon={
                    isLoading ? undefined : <CloudUpload style={{height: "60px", width: "auto"}}/>
                }>
                    {isLoading && <CircularProgress size={60} color={"secondary"}/>}
                    {!isLoading && <Text text={"Upload Crash"} variant={"h4"}/>}

                </Button>

            </Column>
        </Surface>
        <UploadFailedDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}
                            uploadError={uploadState as UploadCrashError}/>
    </div>


}


type UploadState = InitialUploadState | UploadCrashResponse

function isUploadCrashError(obj: UploadState): obj is UploadCrashError {
    return typeof obj === "string"
}

function CrashTextField(props: { error: boolean, log: string, setLog: (value: string) => void }) {
    return <Wrap padding={{bottom: 10, right: 10, left: 10}} width={"max"} flexGrow={1}>
        <TextField error={props.error} value={props.log} onChange={value => props.setLog(value.target.value)} multiline
                   label={"Paste a crash log"} variant={"filled"}
                   style={{width: "100%", height: "100%",}}
        />
    </Wrap>;
}

function HomeTitle() {
    return <Row>
        <CrashyLogo size={100} margin={10}/>
        <Text text="Crashy" style={{fontFamily: "serif"}} variant={"h1"} color={crashyTitleColor}/>
    </Row>;
}

function UploadFailedDialog(props: { dialogOpen: boolean, setDialogOpen: (dialogOpen: boolean) => void, uploadError: UploadCrashError }) {
    return <Dialog
        open={props.dialogOpen}
        onClose={() => props.setDialogOpen(false)}
    >
        <DialogTitle id="responsive-dialog-title">
            {props.uploadError === "Too Large" ? "Log Too Large" : "Invalid Log"}
        </DialogTitle>
        <DialogContent>

            <TextTheme color={dialogBodyColor}>
                <UploadFailedBody error={props.uploadError}/>
            </TextTheme>
        </DialogContent>
    </Dialog>;
}

//rgba(255, 255, 255, 0.7)

//TODO: add a more user friendly way of deleting by using cookies.
// - open the site with ?code=xxxxxx and delete it from the url to prevent misuse, and store it in a cookie.
// - When a code can be found, have a 'are you sure button', but after that, instantly delete with no panel.
// - If the code is incorrect, open up the panel normally and inform the user the thing hey have stored is wrong.
function UploadFailedBody({error}: { error: UploadCrashError }) {
    switch (error) {
        case "Too Large":
            return <Fragment>
                Crashy only supports uploading crashes of up to 1MB in size.<br/>
                We're interested in making more crashes fit in, so if you see this, please
                <Link href={"https://github.com/natanfudge/Crashy/issues/new"}> Open an issue</Link> describing what you
                tried
                to upload!
            </Fragment>
        case "Invalid Crash":
            return <Fragment>
                There's something wrong with your crash log. <br/><br/>
                Think it should be supported by Crashy? <Link
                href={"https://github.com/natanfudge/Crashy/issues/new"}> Open an issue</Link> describing your exotic
                log!
            </Fragment>
    }
}

