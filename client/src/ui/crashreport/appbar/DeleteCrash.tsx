import React from "react";
import {CrashyServer, DeleteCrashResponse} from "../../../server/CrashyServer";
import {Spacer, Wrap} from "../../../fudge-commons/simple/SimpleDiv";
import {getCookieCrashCode, setCookieDeleted} from "../../../utils/Cookies";
import {Text, TextTheme} from "../../../fudge-commons/simple/Text";
import {fadedOutColor} from "../../Colors";
import {getUrlCrashId} from "../../../utils/PageUrl";
import {CircularProgress, Link} from "@mui/material";
import {SimpleButton} from "../../../fudge-commons/simple/SimpleButton";
import {Column, Row} from "../../../fudge-commons/simple/Flex";
import {SimpleTextField} from "../../../fudge-commons/simple/SimpleTextField";


const CRASH_CODE_HELP_URL = "https://github.com/natanfudge/Crashy/blob/main/Crash%20Code.md"

enum DeleteState {
    NoAttemptMade,
    Loading,
    Incorrect,
    Deleted,
    AlreadyDeleted
}

const CodeLength = 6;


export function DeletePopup() {
    const storedCrashCode = React.useMemo(() => getCookieCrashCode(), []);
    return storedCrashCode === undefined ? <UserSuppliedCodeDeletePopup/> :
        <PreSuppliedCodeDeletePopup code={storedCrashCode}/>
}



function UserSuppliedCodeDeletePopup() {
    const [code, setCode] = React.useState("")
    const [deleteState, setDeleteState] = React.useState(DeleteState.NoAttemptMade)

    const label = determineLabel(deleteState)
    return <Column padding={10}>
        <Text align={"center"}
              text={"Enter the code for this crash to delete it"}
              padding={{bottom: 10}}/>

        <Row>
            <SimpleTextField flexGrow={1} label={label !== undefined ? <p>{label}</p> : undefined}
                        error={deleteState === DeleteState.Incorrect}
                        padding={{bottom: 10}}
                        value={code} onValueChanged={setCode}/>
        </Row>

        <DeleteCrashButton code = {code} deleteState = {deleteState} setDeleteState = {setDeleteState}/>

        <Link target="_blank" rel="noopener" underline={"hover"} variant={"subtitle2"} href={CRASH_CODE_HELP_URL}>
            What is my crash code?
        </Link>
    </Column>
}

function PreSuppliedCodeDeletePopup({code}: { code: string }) {
    const [deleteState, setDeleteState] = React.useState(DeleteState.NoAttemptMade)

    const label = determineLabel(deleteState)
    return <Column padding={10}>
        <Text align={"center"}
              text={"Delete this crash log?"}
              padding={{bottom: 10}}/>
        <DeleteCrashButton code = {code} deleteState = {deleteState} setDeleteState = {setDeleteState}/>
        {label !== undefined &&
            <Text text={label} padding={{bottom: 5}} align={"center"} variant={"caption"} color={fadedOutColor}/>}
        <Column>
            <TextTheme color={fadedOutColor} variant={"subtitle2"}>
                You've recently created this log,<br/> so you can delete it without a code.<br/>To delete in the future,
                store this code now:
            </TextTheme>
            <Text padding={{top: 5}} align={"center"} text={code}/>
        </Column>

    </Column>
}

function DeleteCrashButton({code,deleteState,setDeleteState}: {code: string, deleteState: DeleteState, setDeleteState: (value: DeleteState) => void}) {
    return <Row justifyContent={"center"} width={"max"}>
        <SimpleButton margin={{bottom: 15}}
                 alignSelf={"center"} variant={"contained"} width={"fit-content"}
                 disabled={code.length !== CodeLength || deleteState === DeleteState.Loading}
                 onClick={async () => {
                     setDeleteState(DeleteState.Loading)
                     const newState = await deleteCrash(code)
                     setDeleteState(newState);
                     if (newState === DeleteState.Deleted) {
                         // Mark this url as deleted so it won't be displayed anymore
                         setCookieDeleted(true);
                         window.location.reload();
                     }
                 }}>

            <Text text={"DELETE"}/>

        </SimpleButton>
        {deleteState === DeleteState.Loading && <Row position="absolute"  width="max">
            <Spacer flexGrow={1}/>
            <Wrap padding={{right: 30, bottom: 10}}>
                <CircularProgress/>
            </Wrap>
        </Row>}
    </Row>;
}

function determineLabel(deleteState: DeleteState): string | undefined {
    switch (deleteState) {
        case DeleteState.NoAttemptMade:
        case DeleteState.Deleted:
            return undefined
        case DeleteState.Loading:
            return "Deleting..."
        case DeleteState.Incorrect:
            return "Incorrect code"
        case DeleteState.AlreadyDeleted:
            return "This crash doesn't exist anymore"
    }
}


async function deleteCrash(code: string): Promise<DeleteState.Incorrect | DeleteState.Deleted | DeleteState.AlreadyDeleted> {
    const result = await CrashyServer.deleteCrash(getUrlCrashId()!, code);
    switch (result) {
        case DeleteCrashResponse.IncorrectKey:
            return DeleteState.Incorrect
        case DeleteCrashResponse.NoSuchCrashId:
            return DeleteState.AlreadyDeleted
        case DeleteCrashResponse.Success:
            return DeleteState.Deleted
    }
}