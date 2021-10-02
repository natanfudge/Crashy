import React from "react";
import {Column, Row} from "../utils/improvedapi/Flex";
import {Text} from "../utils/improvedapi/Text";
import {CButton, CTextField} from "../utils/improvedapi/Material";
import {CircularProgress, Link} from "@mui/material";
import {CrashyServer, DeleteCrashResponse} from "../CrashyServer";
import {Wrap} from "../utils/improvedapi/Core";
import {getUrlCrashId, setUrlNoCache} from "../utils/PageUrl";
import {getCookieCrashCode} from "../utils/Cookies";

const CRASH_CODE_HELP_URL = "https://github.com/natanfudge/Crashy/blob/main/Crash%20Code.md"

//TODO: proper 'page doesn't exist screen'
//TODO: make sure that once you delete a page it's obvious it has been deleted
enum DeleteState {
    NoAttemptMade,
    Loading,
    Incorrect,
    Deleted,
    AlreadyDeleted
}

//TODO: write doc for crash help
const CodeLength = 6;

export function DeleteSection() {
    const [code, setCode] = React.useState(getCookieCrashCode() ?? "")
    const [deleteState, setDeleteState] = React.useState(DeleteState.NoAttemptMade)

    const label = determineLabel(deleteState)
    return <Column padding={10}>
        <Text text={"Enter the code for this crash to delete it"}/>

        <Row>
            <CTextField flexGrow={1} label={label !== undefined ? <p>{label}</p> : undefined}
                        error={deleteState === DeleteState.Incorrect}
                        padding={{vertical: 10}}
                        value={code} onValueChanged={setCode}/>

            {deleteState === DeleteState.Loading && <Wrap margin={{horizontal: 10}} alignSelf={"center"}>
                <CircularProgress/>
            </Wrap>}
        </Row>


        <CButton margin={{bottom: 15}} alignSelf={"center"} variant={"contained"} width={"fit-content"}
                 disabled={code.length !== CodeLength}
                 onClick={async () => {
                     setDeleteState(DeleteState.Loading)
                     const newState = await deleteCrash(code)
                     setDeleteState(newState);
                     if (newState === DeleteState.Deleted) {
                         setCode("")
                         setUrlNoCache(true);
                     }
                 }}>
            <Text text={"DELETE"}/>
        </CButton>

        <Link target="_blank" rel="noopener" underline={"hover"} variant={"subtitle2"} href={CRASH_CODE_HELP_URL}>
            What is my crash code?
        </Link>
    </Column>
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