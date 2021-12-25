import {RichExceptionDetails} from "crash-parser/src/model/RichCrashReport";
import {TextTheme} from "../../utils/simple/Text";
import React from "react";

export function JVMDetailsSection(props: { details: RichExceptionDetails }) {
    return <TextTheme overflow="auto" padding={5} wordBreak={"break-all"}
                      whiteSpace="pre-wrap">
        {props.details.rawText}
    </TextTheme>
}