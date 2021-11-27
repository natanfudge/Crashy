import {Column} from "../../utils/simple/Flex";
import {Text} from "../../utils/simple/Text";
import {fadedOutColor} from "../../Colors";
import {Link} from "@mui/material";
import React from "react";
import {Spacer} from "../../utils/simple/SimpleDiv";

export function NoSuchCrashScreen() {
    return <Column height={"max"} alignItems={"center"}>
        <Spacer flexGrow={1}/>
        <Text color={fadedOutColor} text={"Oops!"} alignSelf={"center"} variant={"h1"}/>
        <Spacer height={20}/>
        <Text color={fadedOutColor} variant={"h6"}
              text={"Looks like there's nothing here. Maybe you got the URL wrong?"}/>
        <Spacer height={20}/>
        <Link underline={"hover"} variant={"h5"} href={"/"}>
            Back to safety
        </Link>
        <Spacer flexGrow={5}/>
    </Column>;
}
