
import React from "react";
import {RichExceptionDetails} from "../../../crash/model/RichCrashReport";
import {TextTheme} from "fudge-commons/lib/simple/Text";

export function JVMDetailsSection(props: { details: RichExceptionDetails }) {
    return <TextTheme overflow="auto" padding={5} wordBreak={"break-all"}
                      whiteSpace="pre-wrap">
        {props.details.rawText}
    </TextTheme>
}