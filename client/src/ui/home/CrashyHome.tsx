import React, {Fragment} from "react";
import {Wrap, WrapMultiple} from "../../fudge-commons/simple/SimpleDiv";
import {Button, CircularProgress, Dialog, DialogContent, DialogTitle, Link} from "@mui/material";
import {crashyTitleColor, dialogBodyColor} from "../Colors";
import {Text, TextTheme} from "../../fudge-commons/simple/Text";
import {CrashyLogo} from "../utils/Crashy";
import {Surface} from "../../fudge-commons/simple/Surface";
import {CrashyServer, UploadCrashError, UploadCrashResponse} from "../../server/CrashyServer";
import {CloudUpload} from "@mui/icons-material";
import {Column, Row} from "../../fudge-commons/simple/Flex";
import {SimpleTextField} from "../../fudge-commons/simple/SimpleTextField";
import {goToUploadedCrash} from "../../utils/PageUrl";
import {parseCrashReportRich} from "../../crash/parser/CrashReportEnricher";
import {gzipAsync} from "../../utils/Zip";
import {useScreenSize} from "../../fudge-lib/methods/Gui";


enum InitialUploadState {
    Start,
    Loading,
}

export default function CrashyHome() {
    const [log, setLog] = React.useState("");
    const [uploadState, setUploadState] = React.useState<UploadState>(InitialUploadState.Start)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const isLoading = uploadState === InitialUploadState.Loading

    return <WrapMultiple height="max" width="max">
        <Surface height={"max"}>
            <Column padding={{bottom: 20}} alignItems={"center"} height={"max"}>
                <HomeTitle/>

                <CrashTextField error={isUploadCrashError(uploadState)} log={log} setLog={setLog}/>

                <Button onClick={async () => {
                    // Validate crash
                    try {
                       parseCrashReportRich(log)
                    } catch (e) {
                        setUploadState("Invalid Crash")
                        console.log(e)
                        setDialogOpen(true)
                        return
                    }
                    setUploadState(InitialUploadState.Loading)
                    const response = await CrashyServer.uploadCrash(await gzipAsync(log));
                    if (isUploadCrashError(response)) {
                        setUploadState(response);
                        setDialogOpen(true);
                    } else {
                        goToUploadedCrash({id: response.crashId, code: response.deletionKey})
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
    </WrapMultiple>


}


type UploadState = InitialUploadState | UploadCrashResponse

function isUploadCrashError(obj: UploadState): obj is UploadCrashError {
    return typeof obj === "string"
}

function CrashTextField(props: { error: boolean, log: string, setLog: (value: string) => void }) {
    return <Wrap className={"crashy-text-field"} padding={{bottom: 10, right: 10, left: 10}} width={"max"} flexGrow={1}>
        <SimpleTextField error={props.error} value={props.log} onValueChanged={value => props.setLog(value)} multiline
                         label={"Paste a crash log"} variant={"filled"}
                         width="max" height="max"

        />
    </Wrap>;
}

function HomeTitle() {
    const isPortrait = useScreenSize().isPortrait;
    return <Row>
        <CrashyLogo size={isPortrait ? 60 : 100} margin={10}/>
        <Text text="Crashy" fontFamily="serif" variant={isPortrait ? "h2" : "h1"} color={crashyTitleColor}/>
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

