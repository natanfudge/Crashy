import React, {Suspense, useState} from 'react';
import '../App.css';

import {createTheme, CssBaseline, LinearProgress} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {Column, Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {CrashyCrashReportPage} from "./CrashyCrashReport";
import {getCurrentCrashId} from "./PageUrl";
import {Spacer} from "./improvedapi/Core";
import {Expansion, useExpansion, WithExpansions} from "./improvedapi/Expansion";
import {CButton} from "./improvedapi/Material";
import {ClickCallback} from "./improvedapi/Element";


const CrashyHome = React.lazy(() => import("./CrashyHome"))


export default function App() {
    const outerTheme = createTheme(CrashyTheme);

    const [change, setChange] = useState(true);

    return (
        <ThemeProvider theme={outerTheme}>
            <CssBaseline/>
            <WithExpansions>
                <Column>
                    <CButton onClick={() => setChange(prev => !prev)}>
                        <Text text={"asdfasf"}/>
                    </CButton>
                    {change ? <Row>
                        <ExpansionTest id="1"/>
                        <ExpansionTest id="2"/>
                    </Row> : <Text text={"asdfasd"}/>}
                </Column>
                {/*{CrashyUi()}*/}
                {/*<AnimationTest/>*/}


            </WithExpansions>


        </ThemeProvider>
    )
}


function ExpansionTest(props: { id: string }) {
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const expansion = useExpansion();

    const handleClick: ClickCallback = (htmlElement) => {
        setAnchorEl(htmlElement);
        expansion.toggle();
    };

    return <div>
        <Row>
            <Spacer height={300} width={500} backgroundColor={"red"}/>
            <CButton onClick={handleClick}>
                <Text text={"show/hide"}/>
            </CButton>
        </Row>
        <Expansion anchorReference="bottom-center" position={"top-center"} style={{border: "solid 2px red"}}
                   id={props.id} state={expansion} onDismiss={() => expansion.hide()} anchor={anchorEl}>
            <Spacer style={{zIndex: 30, position: "relative"}} height={200} width={200} backgroundColor={"blue"}/>
        </Expansion>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium amet cupiditate delectus doloribus eum
        molestias necessitatibus, nesciunt odit omnis praesentium quae, quod ratione recusandae rem sunt ut vero,
        voluptates voluptatum! Culpa dolorum eius et eveniet explicabo facere facilis fugiat hic incidunt labore magnam
        magni modi neque nobis optio reiciendis repellat, sapiente sed sequi sunt totam voluptate voluptatibus. Dicta
        eligendi eum fugit inventore ipsam, iusto laudantium saepe totam. Deserunt error et illo illum ipsum nostrum
        sunt ullam? Dolor dolorem ea fugit nulla pariatur perferendis placeat quidem recusandae sapiente voluptas!
        Asperiores dolorum explicabo fugiat nisi omnis quasi qui sequi? A accusantium aliquam amet animi architecto
        beatae consequatur culpa deserunt dicta dolorem doloribus dolorum ea error esse, eum eveniet, excepturi fugit
        harum incidunt inventore labore laboriosam, mollitia nam non nulla odio pariatur ratione repellendus rerum saepe
        sed similique sint sunt ullam veniam veritatis voluptatum. Accusamus, delectus distinctio, doloremque dolorum ea
        fugiat possimus provident quam quas quibusdam, soluta voluptatum? At eius, libero mollitia nemo possimus quia
        similique? Adipisci ducimus minus necessitatibus, odio praesentium voluptatem voluptatibus. Accusantium aliquam
        consequatur debitis illum ipsum iure maiores officiis porro praesentium quas quidem, quis quo, reiciendis saepe
        sit! Earum inventore ipsam iste pariatur possimus! A asperiores assumenda deleniti ducimus et exercitationem
        facere fugiat hic in ipsa iure, iusto laudantium magnam minima molestias nemo nesciunt nihil nisi obcaecati
        officia placeat quae quaerat recusandae reiciendis saepe sequi tenetur unde vero voluptatem voluptates? Commodi
        facere fugit illum non nulla ratione rem sunt ut. Accusamus aliquam aut cum, delectus illo in laborum laudantium
        mollitia nihil nobis placeat quae quam quasi quidem quisquam quo quod recusandae repellendus sed sit sunt vero
        voluptatum. Ab aperiam architecto asperiores assumenda corporis deserunt dolorem dolores ducimus, ex
        exercitationem inventore molestiae molestias non nostrum, porro provident quaerat quos reiciendis tempore velit
        vero voluptas voluptate! A error fugit impedit nobis reiciendis sint, sit temporibus tenetur vitae voluptate,
        voluptatem, voluptatum! Corporis harum illo praesentium quam ratione similique voluptates voluptatum. Aliquam
        animi commodi debitis delectus deserunt eius eligendi explicabo hic in inventore ipsam laborum magni molestiae
        necessitatibus odit officiis, possimus quia repudiandae tenetur ut velit veritatis voluptatibus. Accusantium
        asperiores at blanditiis consectetur cumque delectus deserunt dolore dolorum eligendi est facilis harum, illum
        itaque minus obcaecati omnis perspiciatis quam quibusdam, quidem quisquam rem rerum sed sequi veritatis vitae
        voluptate voluptatibus! Aperiam architecto aspernatur cumque deleniti distinctio dolor doloremque earum,
        eligendi error esse excepturi expedita explicabo fuga labore magnam mollitia nihil non odio officia officiis
        porro quos rem, repellat reprehenderit repudiandae tempora temporibus unde vel velit, veritatis vero vitae
        voluptas voluptatem. Ab blanditiis consequatur consequuntur delectus dicta dignissimos doloremque esse ex facere
        fugiat iusto laborum magni, molestiae omnis possimus quasi quibusdam quos saepe ut voluptatibus. Atque commodi
        delectus dolores esse ipsum, maxime nemo odit praesentium quam quasi veniam, voluptate! A, accusamus at culpa
        dolorem eos esse eveniet expedita explicabo facilis in inventore labore libero magnam maxime omnis perspiciatis
        placeat possimus quaerat quo recusandae reiciendis sit tenetur voluptatum. Ab, accusamus architecto asperiores
        deserunt dolorem doloremque ea esse laudantium natus nostrum quasi reiciendis sapiente vel voluptatibus.
    </div>
}


function CrashyUi() {
    if (window.location.pathname === "/") {
        return <Suspense fallback={<LinearProgress/>}>
            <CrashyHome/>
        </Suspense>
    } else {
        return <CrashyCrashReportPage crashId={getCurrentCrashId()}/>;
    }
}


//Fabric:  befth2S6e4NfzIxFieDs
//Forge: X


