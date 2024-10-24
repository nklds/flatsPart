import MainLayout from "@/components/Layout/MainLayout";
import styles from "./filter-apartment.module.scss"
import React, {useEffect, useRef, useState} from "react";
import Filters from "@/components/Pages/FilterApartmentPage/Filters";
import FlatCard, {translateFlat} from "@/components/CommonComponents/FlatCard/FlatCard";
import Grid from "@mui/material/Grid";
import SectionRow from "@/components/CommonComponents/SectionRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {CircularProgress, useTheme} from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';


const apiPath = 'https://chkalov2.spb.ru/api/v2/flats/';
const debounceTime = 1000;

const Flats = ({
                             allFlats, roomsTotalMax, priceTotalMin, priceTotalMax, squareTotalMin, squareTotalMax, floorsTotal
                         }) => {

    const [flats, setFlats] = useState(allFlats)
    const [lastChanged, setLastChanged] = useState();
    const [queryState, setQueryState] = useState({
        selectedRooms: [],
        selectedPriceMin: priceTotalMin,
        selectedPriceMax: priceTotalMax,
        selectedSquareMin: squareTotalMin,
        selectedSquareMax: squareTotalMax,
        selectedFloorMin: 1,
        selectedFloorMax: floorsTotal,
        selectedSort: 'price',
        selectedOrder: 'asc',
    });

    const [isLoading, setIsLoading] = useState(true)


    const rooms = [...Array(roomsTotalMax + 1).keys()]; //[0,1...roomsMax];

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [areFiltersFixed, setAreFiltersFixed] = useState(false);

    const filtersRef = useRef();
    const flatsRef = useRef();

    const theme = useTheme();

    useEffect(() => {
        if (lastChanged === undefined) setLastChanged(Date.now());

        if (Date.now() - lastChanged < debounceTime) {
            if (window.debounceTimeout !== undefined) {
                clearTimeout(window.debounceTimeout);

            }
        }
        setLastChanged(Date.now());

        let dataStr = `?`;
        dataStr += `size=${queryState.selectedRooms.toString()}&`
        dataStr += `price_min=${queryState.selectedPriceMin}&`
        dataStr += `price_max=${queryState.selectedPriceMax}&`
        dataStr += `square_min=${queryState.selectedSquareMin}&`
        dataStr += `square_max=${queryState.selectedSquareMax}&`
        dataStr += `floor_min=${queryState.selectedFloorMin}&`
        dataStr += `floor_max=${queryState.selectedFloorMax}&`
        dataStr += `sort=${queryState.selectedSort}&`
        dataStr += `order=${queryState.selectedOrder}`

        window.debounceTimeout = setTimeout(async () => {
            setIsLoading(true);
            let newFlats = await fetch(apiPath + dataStr);
            newFlats = await newFlats.json();
            setFlats(newFlats.flats.data.map(flat => translateFlat(flat)));
            setIsLoading(false);

        }, debounceTime);

    }, [queryState]);


    useEffect(() => {
        window.addEventListener(`scroll`, () => {
            if (window.pageYOffset >= flatsRef.current.getBoundingClientRect().top) {
                setAreFiltersFixed(true);
            } else {
                setAreFiltersFixed(false);
            }
        }, {passive: true})
    }, [])


    const [flatsIdsInFavourites, setFlatsIdsInFavourites] = useState(false);
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
            ? setFlatsIdsInFavourites(flatsIdsInFavourites.filter(flat => flat.toString() !== id.toString()))
            : setFlatsIdsInFavourites([
                ...flatsIdsInFavourites,
                id
            ])
    }

    return (
        <SectionRow mt={19}>
            <Typography variant={"h2"} component={"h1"} mb={5}>
                Выбор квартиры
            </Typography>

            {areFiltersFixed && <Box component={`button`} onClick={() => setIsFilterVisible(!isFilterVisible)}
                                     sx={{
                                         display: {xs: "block", lg: "none"}
                                     }}
                                     className={styles.fixed}
                                     style={{
                                         zIndex: 4,
                                         top: `56px`
                                     }}
            >
                <TuneIcon/> {isFilterVisible ? `Скрыть` : `Показать`} фильтры
            </Box>}
            <Grid container component={`section`} spacing={3} sx={{
                alignItems: "flex-start",
            }}>
                <Grid item xs={12} lg={3}>
                    <Box ref={filtersRef} className={areFiltersFixed && styles.fixed} sx={{
                        zIndex: {
                            xs: (!isFilterVisible) ? `-1 !important` : 3,
                            lg:  `3 !important`
                        }
                    }}>

                        <Box sx={{
                            transition: `transform 0.5s ease-in-out`,
                            transformOrigin: `top`,
                            backgroundColor: `var(--white)`,
                            minHeight: {
                                xs: `100vh`,
                                sm: `unset`
                            },
                            pb: 3,
                            transform: {
                                xs: (isFilterVisible || !areFiltersFixed) ? `scale(1)` : `scale(0)`,
                                lg: `scale(1)`
                            },

                        }}>
                            <Filters sx={{
                                width: {
                                    xs: `100%`,
                                    lg: `288px`
                                },
                            }}

                                     allFlats={allFlats} rooms={rooms}
                                     roomsTotalMax={roomsTotalMax} priceTotalMin={priceTotalMin}
                                     priceTotalMax={priceTotalMax}
                                     squareTotalMin={squareTotalMin} squareTotalMax={squareTotalMax}
                                     floorsTotal={floorsTotal}

                                     queryState={queryState} setQueryState={setQueryState}
                            />
                        </Box>

                    </Box>
                </Grid>


                <Grid ref={flatsRef} item component={`ul`} container spacing={3} xs={12} lg={9}>
                    {isLoading
                        ? <Grid item xs={12} sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: {
                                xs: `100vh`,
                                lg: `60vh`
                            },
                        }}><CircularProgress/></Grid>
                        : flats.map((flat, idx) => {
                            return (

                                <Grid key={`flat-${idx}`} item xs={12} sm={6} md={4}>
                                    {console.log(`flats->${flatsIdsInFavourites}`)}
                                    <FlatCard  {...flat} handleFavouritesClick={handleFavouritesClick}
                                               flatInFavourites={flatsIdsInFavourites ? flatsIdsInFavourites.includes(flat.id) : false}/>
                                </Grid>
                            )
                        })}
                </Grid>
            </Grid>

        </SectionRow>
    )
}

export default Flats;

Flats.getLayout = function getLayout(page) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

// /api/choice_apartment?size=&price_min=1.74&price_max=11.18&square_min=22.92&square_max=76.49&floor_min=2&floor_max=11&section=all&sort=all/cheap/expensive/small/big

export async function getStaticProps(context) {

    let allFlats = await fetch(apiPath);
    allFlats = await allFlats.json();
    allFlats = allFlats.flats.data.map((flat, idx) => {
        return translateFlat(flat);
    })


    return {
        props: {
            allFlats,
            roomsTotalMax: 3,
            priceTotalMin: 3.5,
            priceTotalMax: 22,
            squareTotalMin: 22,
            squareTotalMax: 80,
            floorsTotal: 22,
        }
    }
}
