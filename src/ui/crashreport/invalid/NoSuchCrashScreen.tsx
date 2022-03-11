import {Column} from "fudge-commons/lib/src/simple/Flex";
import {Spacer} from "fudge-commons/lib/src/simple/SimpleDiv";
import {fadedOutColor} from "../../Colors";
import {Text} from "fudge-commons/lib/src/simple/Text";
import {Link} from "@mui/material";


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
