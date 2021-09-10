import React from "react";
import {Surface} from "./improvedapi/Material";
import {Column} from "./improvedapi/Flex";
import {Button, TextField, Typography} from "@mui/material";
import {Wrap} from "./improvedapi/Core";
import {CloudUpload} from "@mui/icons-material";
import {Text} from "./improvedapi/Text";

export default function CrashyHome() {
    const [log, setLog] = React.useState("");
    return <Surface height={"max"}>
        <Column padding={{bottom: 20}} alignItems={"center"} height={"max"} style={{}}>
            <Typography fontFamily={"serif"} variant={"h1"}>
                Crashy
            </Typography>
            {/*<Text text={""} variant={"h1"}/>*/}

            <Wrap padding={10} width={"max"} flexGrow={1}>
                <TextField value={log} onChange={value => setLog(value.target.value)} multiline
                           label={"Paste a crash log"} variant={"filled"}
                           style={{width: "100%", height: "100%",}}
                />
            </Wrap>


            <Button disabled={log === ""} size={"large"} variant={"contained"} color="primary" startIcon={
                <CloudUpload style={{height: "60px", width: "auto"}}/>
            }>
                <Text text={"Upload Crash"} variant={"h4"}/>
            </Button>

        </Column>
    </Surface>

}