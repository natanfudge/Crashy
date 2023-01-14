import {Column} from "../../../fudge-commons/simple/Flex";
import {Spacer} from "../../../fudge-commons/simple/SimpleDiv";
import {fadedOutColor} from "../../Colors";
import {Text} from "../../../fudge-commons/simple/Text";
import {Link} from "@mui/material";


export function NoSuchCrashScreen() {
    return <InvalidCrashScreen title="Oops!"
                               description={"Looks like there's nothing here. Maybe you got the URL wrong?"}/>
}

//TODO: check back on 00b639b2-c8ce-43f7-843d-e1cceebb8899
export function CrashArchivedScreen() {
    return <InvalidCrashScreen title={"Archived"} description={"No one has touched this crash log in a long long while... We will find it for you, but it will take some time. Check back later."}/>
}


function InvalidCrashScreen(props: {title: string, description: string}) {
    return <Column height={"max"} alignItems={"center"}>
        <Spacer flexGrow={1}/>
        <Text color={fadedOutColor} text={props.title} alignSelf={"center"} variant={"h1"}/>
        <Spacer height={20}/>
        <Text color={fadedOutColor} variant={"h6"}
              text={props.description}/>
        <Spacer height={20}/>
        <Link underline={"hover"} variant={"h5"} href={"/"}>
            Back to safety
        </Link>
        <Spacer flexGrow={5}/>
    </Column>;
}