import MainLayout from "@/components/Layout/MainLayout";
import React, {useEffect, useRef, useState} from "react";
import Grid from "@mui/material/Grid";
import SectionRow from "@/components/CommonComponents/SectionRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {CircularProgress, useTheme} from "@mui/material";
import Decoration from "@/components/CommonComponents/Decoration";
import Link from "next/link";
import {useRouter} from "next/router";
import Image from "next/image";
import Button from "@/components/CommonComponents/Button/Button";
import MortgageSection from "@/components/CommonComponents/MortgageSection";
import Form from "@/components/CommonComponents/Form";
import FavouritesIcon from "@/components/CommonComponents/FavouritesIcon";
import ShareIcon from "@/components/CommonComponents/ShareIcon";
import DIcon from "@/components/CommonComponents/DIcon";
import styles from "./print.module.scss"

export const FlatInfoSection = ({flat}) => {
    const theme = useTheme()
    return <Grid container>
        <Grid item xs={3}>
            <Typography variant={"h6"} color={theme.palette.colors.gray}>
                Площадь
            </Typography>
            <Typography variant={"h5"} color={"black"} mb={3}>
                {flat.total_square}
            </Typography>


            <Typography variant={"h6"} color={theme.palette.colors.gray}>
                Площадь кухни
            </Typography>
            <Typography variant={"h5"} color={"black"} mb={3}>
                {flat.kitchen_square}
            </Typography>
        </Grid>

        <Grid item xs={3}>
            <Typography variant={"h6"} color={theme.palette.colors.gray}>
                Сдача
            </Typography>
            <Typography variant={"h5"} color={"black"} mb={3}>
                2026 г.
            </Typography>


            <Typography variant={"h6"} color={theme.palette.colors.gray}>
                Этаж
            </Typography>
            <Typography variant={"h5"} color={"black"} mb={3}>
                {flat.floor}/12
            </Typography>
        </Grid>

        <Grid item xs={3}>
            <Typography variant={"h6"} color={theme.palette.colors.gray}>
                Жилая площадь
            </Typography>
            <Typography variant={"h5"} color={"black"} mb={3}>
                {flat.residental_square}
            </Typography>


            <Typography variant={"h6"} color={theme.palette.colors.gray}>
                Секция
            </Typography>
            <Typography variant={"h5"} color={"black"} mb={3}>
                4
            </Typography>
        </Grid>

        <Grid item xs={3}>
            <Typography variant={"h6"} color={theme.palette.colors.gray}>
                Количество комнат
            </Typography>
            <Typography variant={"h5"} color={"black"} mb={3}>
                {flat.size}
            </Typography>


            <Typography variant={"h6"} color={theme.palette.colors.gray}>
                Тип планировки
            </Typography>
            <Typography variant={"h5"} color={"black"} mb={3}>
                Евро
            </Typography>
        </Grid>
    </Grid>
}


const Flat = ({flat, host}) => {
    const theme = useTheme();
    const router = useRouter();


    const [flatsIdsInFavourites, setFlatsIdsInFavourites] = useState([]);


    useEffect(() => {
        let flatsFromLocalStorage = window.localStorage.getItem(`favouriteFlats`);
        if (flatsFromLocalStorage) setFlatsIdsInFavourites(JSON.parse(flatsFromLocalStorage))
        else setFlatsIdsInFavourites([])
    }, [])

    useEffect(() => {
        if (flatsIdsInFavourites) window.localStorage.setItem(`favouriteFlats`, JSON.stringify(flatsIdsInFavourites));
    }, [flatsIdsInFavourites])


    const handleFavouritesClick = (id) => {
        flatsIdsInFavourites.includes(id)
            ? setFlatsIdsInFavourites(flatsIdsInFavourites.filter(f => f.toString() !== flat.id.toString()))
            : setFlatsIdsInFavourites([
                ...flatsIdsInFavourites,
                id
            ])
    }


    return <>
        <Decoration animations={{pattern: {direction: "right"}}} sx={{
        }}>
            <SectionRow pt={19}>
                <Grid className={"forPrint"} container spacing={3} mb={9}>
                    <Grid item xs={12} lg={6} order={1}>

                        <Typography variant={"h2"} component={"h1"} mb={5}>
                            {flat.size !== 'студия' ? `${flat.size} комнатная квартира` : "Студия"}
                        </Typography>
                        <Typography onClick={() => router.back()} variant={"h6"} color={theme.palette.colors.darkBlue}
                                    mb={3} sx={{
                            textDecoration: "underline",
                            cursor: "pointer"
                        }}>
                            Назад
                        </Typography>

                        <FlatInfoSection flat={flat}/>

                        <Box>
                            <Typography variant={"h3"} mr={3} component={"span"}>
                                {flat.price.toLocaleString()} ₽
                            </Typography>
                            <Typography variant={"h6"} color={"black"} component={"span"}>
                                При 100% оплате
                            </Typography>
                        </Box>

                        <div className={"notPrinted"}>
                            <Button  variant={"arrowed"} href={"#form"} mt={5} component={"a"}>
                                Заказать обратный звонок
                            </Button>
                        </div>
                    </Grid>

                    <Grid container xs={12} lg={5} spacing={3} item sx={{
                        order: {
                            xs: 0,
                            lg: 1
                        }
                    }}>
                        <Grid item sm={2}/>
                        <Grid item xs={8} sx={{
                            position: "relative",
                            minHeight: 300
                        }}>
                            <Image
                                src={`https://atr-crm.ru/${flat.plan2d}.webp`}
                                fill
                                alt={"flat"}
                                style={{
                                    objectFit: "contain"
                                }}
                            />

                        </Grid>

                        <Grid item xs={2} className={"notPrinted"}>
                            <Box sx={{
                            display: "inline-block",
                            border: "1px solid"+theme.palette.colors.lightGray,
                            padding: 2,
                            borderRadius: "50%",
                            '& svg': {
                                transform: "translateY(3px)",
                                transition: `fill 0.3s ease-in-out`
                            },
                            cursor: "pointer"
                        }} mb={3} onClick={() => handleFavouritesClick(flat.id)}>
                            <FavouritesIcon fill={flatsIdsInFavourites?.includes(flat.id) ? theme.palette.colors.darkBlue : "transparent"}
                                            stroke={theme.palette.colors.darkBlue}/>
                        </Box>

                            <Box component={Link} target={"_blank"} mb={3}
                                 href={
                                     `http://vk.com/share.php?url=${host}/flats/${flat.id}&image=https://atr-crm.ru/data/flats/${flat.id}/2d.webp&title=${flat.size} комнатная квартира в ЖК «Симметрия»`
                                 }
                                 sx={{
                                display: "inline-block",
                                border: "1px solid"+theme.palette.colors.lightGray,
                                padding: 2,
                                borderRadius: "50%",
                                '& svg': {
                                    transform: "translateY(3px)",
                                    transition: `fill 0.3s ease-in-out`
                                },
                                cursor: "pointer"
                            }} >
                                <ShareIcon />
                            </Box>

                            <Box onClick={()=>print()} mb={3}

                                 sx={{
                                     display: "inline-block",
                                     border: "1px solid"+theme.palette.colors.lightGray,
                                     padding: 0.7,
                                     borderRadius: "50%",
                                     '& svg': {
                                         transform: "translateY(3px)",
                                         transition: `fill 0.3s ease-in-out`
                                     },
                                     cursor: "pointer"
                                 }} >
                                <DIcon />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <MortgageSection className={"notPrinted"}/>
            </SectionRow>
        </Decoration>
        <Decoration animations={{bgColor: true}} className={"notPrinted"} >
            <SectionRow py={9}>
                <Grid container spacing={3}>

                    <Grid item container xs={12} lg={6}>
                        <Grid item xs={12} sm={7} lg={8} component={Typography} mb={5}>
                            Сотрудники отдела продаж знают все о Жилом Комплексе Симметрия и с удовольствием
                            расскажут вам о самых выгодных предложениях, ипотечных программах и рассрочке.
                            Оставьте заявку на обратный звонок и узнайте, как приобрести квартиру с максимальной
                            выгодой для вас.
                        </Grid>
                        <Grid item xs={12} sm={5} lg={10} position={`relative`} overflow={`hidden`}>
                            <Image
                                src={`/images/mortgage/scheme.png`}
                                width={496}
                                height={312}
                                style={{
                                    objectFit: "contain",
                                    zIndex: -1
                                }}
                                alt={`ЖК "Симметрия"`}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Form id={`form`}/>
                    </Grid>
                </Grid>
            </SectionRow>
        </Decoration>
    </>
}

export async function getServerSideProps({params}) {
    let flat = await fetch(`https://chkalov2.spb.ru/api/description_apartment/${params.flatId}`)
    flat = await flat.json()
    let host = process.env.HOST


    return {
        props: {
            flat,
            host
        }
    }
}

Flat.getLayout = function getLayout(page) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}
export default Flat;
