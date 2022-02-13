import {EnableAssertions} from "../../Crashy";

export {}
const RELEASE_PATTERN = /\\d+\\.\\d+(\\.\\d+)?/.compile();
const SNAPSHOT_PATTERN = /(?:Snapshot )?(\\d+)w0?(0|[1-9]\\d*)([a-z])/.compile();

function getRelease( version: string): string {
    if (RELEASE_PATTERN.test(version)) return version;

    if(EnableAssertions && !isProbableVersion(version)) throw new Error("Unexpected version " + version);

    let pos = version.indexOf("-pre");
    if (pos >= 0) return version.substring(0, pos);

    pos = version.indexOf(" Pre-Release ");
    if (pos >= 0) return version.substring(0, pos);

    pos = version.indexOf(" Release Candidate ");
    if (pos >= 0) return version.substring(0, pos);


    const match = SNAPSHOT_PATTERN.exec(version);
    if (match !== null) {
        const year = parseInt(match[1]);
        const week = parseInt(match[2]);

        if (year === 20 && week >= 6) {
            return "1.16";
        } else if (year === 19 && week >= 34) {
            return "1.15";
        } else if (year === 18 && week >= 43 || year === 19 && week <= 14) {
            return "1.14";
        } else if (year === 18 && week >= 30 && week <= 33) {
            return "1.13.1";
        } else if (year === 17 && week >= 43 || year === 18 && week <= 22) {
            return "1.13";
        } else if (year === 17 && week === 31) {
            return "1.12.1";
        } else if (year === 17 && week >= 6 && week <= 18) {
            return "1.12";
        } else if (year === 16 && week === 50) {
            return "1.11.1";
        } else if (year === 16 && week >= 32 && week <= 44) {
            return "1.11";
        } else if (year === 16 && week >= 20 && week <= 21) {
            return "1.10";
        } else if (year === 16 && week >= 14 && week <= 15) {
            return "1.9.3";
        } else if (year === 15 && week >= 31 || year === 16 && week <= 7) {
            return "1.9";
        } else if (year === 14 && week >= 2 && week <= 34) {
            return "1.8";
        } else if (year === 13 && week >= 47 && week <= 49) {
            return "1.7.4";
        } else if (year === 13 && week >= 36 && week <= 43) {
            return "1.7.2";
        } else if (year === 13 && week >= 16 && week <= 26) {
            return "1.6";
        } else if (year === 13 && week >= 11 && week <= 12) {
            return "1.5.1";
        } else if (year === 13 && week >= 1 && week <= 10) {
            return "1.5";
        } else if (year === 12 && week >= 49 && week <= 50) {
            return "1.4.6";
        } else if (year === 12 && week >= 32 && week <= 42) {
            return "1.4.2";
        } else if (year === 12 && week >= 15 && week <= 30) {
            return "1.3.1";
        } else if (year === 12 && week >= 3 && week <= 8) {
            return "1.2.1";
        } else if (year === 11 && week >= 47 || year === 12 && week <= 1) {
            return "1.1";
        }
    }

    return null;
}