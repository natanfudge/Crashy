import React, {CSSProperties, Suspense, useState} from 'react';
import '../App.css';

import {Box, createTheme, CssBaseline, FormControlLabel, Grow, LinearProgress, Switch} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {CrashyCrashReportPage} from "./CrashyCrashReport";
import {getCurrentCrashId} from "./PageUrl";
import {Spacer} from "./improvedapi/Core";
import {Expansion, useExpansion, WithExpansions} from "./improvedapi/Expansion";
import {CButton} from "./improvedapi/Material";
import {ClickCallback} from "./improvedapi/Element";
import {Transition, TransitionStatus} from "react-transition-group";


const CrashyHome = React.lazy(() => import("./CrashyHome"))


export default function App() {
    const outerTheme = createTheme(CrashyTheme);

    return (
        <ThemeProvider theme={outerTheme}>
            <CssBaseline/>
            <WithExpansions>
                {/*<AnimationTest/>*/}
                <Row>
                    <ExpansionTest id="1"/>
                    <ExpansionTest id="2"/>
                </Row>

            </WithExpansions>

            {/*{CrashyUi()}*/}
        </ThemeProvider>
    )
}

const duration = 300;
const defaultStyle = {
    transition: `transform ${duration}ms ease-in-out`,
    transform : "scale(0.0)"
}

const transitionStyles: Partial<Record<TransitionStatus,CSSProperties>> = {
    entering: { transform : "scale(1.0)" },
    entered:  { transform : "scale(1.0)" },
    exiting:  { transform : "scale(0.0)" },
    exited:  { transform : "scale(0.0)" }
};

// function Grow() {
//     const [inProp, setInProp] = useState(false);
//     return (
//         <div>
//             <Transition in={inProp} timeout={500}>
//                 {state => (
//                     <div style={{
//                         ...defaultStyle,
//                         ...transitionStyles[state]
//                     }}>
//                         I'm a fade Transition!
//                     </div>
//                 )}
//             </Transition>
//             <button onClick={() => setInProp((prev) => !prev)}>
//                 Click to Enter
//             </button>
//         </div>
//     );
// }

function AnimationTest() {
      const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    return (
        <Box sx={{ height: 180 }}>
            <FormControlLabel
                control={<Switch checked={checked} onChange={handleChange} />}
                label="Show"
            />
            <Box sx={{ display: 'flex' }}>
                <Grow in={checked}><div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut consequatur dolorum enim eveniet id maxime non obcaecati odio, odit officiis placeat quae quo, quos. Consectetur culpa, doloremque eaque expedita fugit illum labore laudantium mollitia nesciunt, officiis quis quisquam quos reprehenderit repudiandae sit suscipit ut? Aliquam, blanditiis consectetur consequatur cum deserunt fuga fugit impedit inventore ipsa nihil obcaecati perferendis quibusdam, repellat repellendus temporibus ut velit voluptates. Adipisci alias architecto at aut corporis delectus deserunt dolore excepturi exercitationem laboriosam laudantium magni modi nostrum numquam officia placeat, porro quaerat quibusdam, ratione rem repellat, repellendus repudiandae sed similique sit temporibus veniam voluptatibus. A autem consectetur, cum deserunt dignissimos, doloremque earum, ex facilis minus modi quasi saepe sequi tempora! Amet eveniet expedita illo nobis quos repellendus, repudiandae sit tenetur! Cumque debitis dolorem ex necessitatibus nihil pariatur sunt ut! Animi commodi dicta dignissimos ea est eveniet, fugiat illum necessitatibus praesentium reprehenderit saepe sint, sit temporibus, totam ullam! Esse non numquam suscipit. Animi atque aut commodi corporis, cumque deleniti distinctio doloribus ducimus eaque eveniet iure minima mollitia nam nisi, nobis nulla placeat possimus quae quaerat quam quibusdam quos reiciendis rem repellat saepe, vel voluptatem voluptatum? Accusantium ad amet at consequatur cupiditate deserunt dolor dolorem doloremque dolorum ducimus eaque eligendi enim, esse et eum fugiat harum ipsa iste, laborum mollitia nobis odit optio placeat quae quisquam quod recusandae reiciendis sint sit tempora temporibus ullam voluptatem voluptatibus? Architecto aut commodi enim et expedita laudantium libero numquam, pariatur tenetur. Accusamus aliquam amet consectetur ea et hic id iure labore libero neque numquam officiis, optio possimus quae qui quos soluta ut, vitae voluptatibus voluptatum! Aliquid amet atque incidunt quisquam vitae. Ad amet at consectetur corporis cum debitis dolorem ea earum et explicabo fugiat hic illum inventore iusto laboriosam laudantium libero maxime minima minus modi natus, nemo nihil nisi non obcaecati officia perspiciatis quam recusandae reiciendis sed similique sunt temporibus ullam vitae voluptatem voluptates voluptatum! Atque deleniti ex laudantium necessitatibus nulla quia rem ullam. Aperiam atque consequatur eveniet obcaecati officiis quia quidem, reiciendis tempore vitae! Ab cum dolor, expedita minima necessitatibus neque recusandae reiciendis rem reprehenderit saepe. Ab culpa distinctio doloremque, doloribus et facilis harum incidunt magnam modi officiis omnis repudiandae rerum saepe soluta totam. Expedita fugit ipsa laborum maxime molestiae nemo sequi! At autem esse eum itaque, iusto labore libero molestias nobis numquam quae quia quis sapiente totam? Accusantium, ad doloremque in itaque natus, nisi nulla, optio repudiandae saepe ullam unde vel vero. A accusamus aliquam, blanditiis consequatur dolore eius et fugit harum illum laborum libero minus molestiae, nesciunt quaerat quidem quisquam quo repellat tenetur vitae voluptatibus! A aliquam aperiam asperiores aut eius ex explicabo, fugit inventore ipsum itaque iure labore laborum magnam modi molestiae molestias natus neque nihil, nobis pariatur porro quaerat quidem quis quos rerum sapiente sit tempora ut vel velit. Accusamus delectus enim illo odit placeat, quisquam soluta sunt tempore. Accusamus aliquam aliquid, aspernatur assumenda beatae blanditiis culpa distinctio fugit iste laudantium libero natus officia officiis pariatur quae quasi quisquam repellendus sed sequi ullam unde veritatis voluptas voluptate.
                </div></Grow>
            </Box>
        </Box>
    );
}


function ExpansionTest(props: { id: string }) {
    const [anchorEl, setAnchorEl] = React.useState<Element | undefined>(undefined);
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
        <Expansion anchorReference="bottom-center" position={"top-center"} style={{border: "solid 2px red"}} id={props.id} state={expansion} onDismiss={() => {
        }} anchor={anchorEl}>
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


