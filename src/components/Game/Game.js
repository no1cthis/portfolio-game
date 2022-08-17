import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {useNavigate} from 'react-router-dom'

import areas from './img/Layers.json'

import mapPng from './img/map.png'
import idlePng from './img/playerIdleDown.png'
import playerDownPng from './img/playerDown.png'
import playerUpPng from './img/playerUp.png'
import playerLeftPng from './img/playerLeft.png'
import playerRightPng from './img/playerRight.png'
import frontPng from './img/front.png'

import cl from'./game.module.scss'

function Game({setOpenModal, modals, setModal}) {

    const navigate = useNavigate()

    const canvas    = useRef(null)
    const ctx       = useRef(null)
    
    let modalsLocal = {...modals}

    const config = useMemo(() =>({
        mapWidth:               100,
        zoomMap:                4,
        pixTiles:               16,
        windowWidth:            Math.floor(canvas.width/16),
        windowHeight:           Math.floor(canvas.height/16),
        playerSpeed:            10,
        offsetX:                -300,
        offsetY:                -2200
    }), [])
    let playerSpeed = config.playerSpeed
    let map, front, player
    let isWelcomeBoardArea  = false
    let isComingSoonArea    = false
    let isHolographArea     = false
    let isBgArea            = false
    let isTestCompany1Area  = false
    let isCodeEditorArea    = false
    let isWeatherArea       = false

    let lastPressed;

    const pressedKeys ={
        w:      false,
        a:      false,
        s:      false,
        d:      false,
        shift:  false
    }

    const mapImage = new Image
    mapImage.src = mapPng
    const playerIdle = new Image;
    playerIdle.src = idlePng
    const playerDown = new Image;
    playerDown.src = playerDownPng
    const playerUp = new Image;
    playerUp.src = playerUpPng
    const playerLeft = new Image;
    playerLeft.src = playerLeftPng
    const playerRight = new Image;
    playerRight.src = playerRightPng
    const frontImage = new Image;
    frontImage.src = frontPng

    //MODALS START
    const openModal = useCallback((e) =>{
        switch(e.keyCode){
            case 13:
                if(isWelcomeBoardArea){
                    modalsLocal.welcomePage = true;
                    setModal(modalsLocal)
                    break;
                }
                if(isCodeEditorArea){
                    if(modalsLocal.codeEditor){
                        navigate('/code-editor')
                    }
                    modalsLocal.codeEditor=true  
                    setModal(modalsLocal)
                    break;
                }
                if(isComingSoonArea){
                    if(modalsLocal.comingSoon){
                        navigate('/')
                    }
                    modalsLocal.comingSoon=true  
                    setModal(modalsLocal)
                    break;
                }
                if(isHolographArea){
                    if(modalsLocal.holograph){
                        navigate('/holograph')
                    }
                    modalsLocal.holograph=true  
                    setModal(modalsLocal)
                    break;
                }
                if(isBgArea){
                    if(modalsLocal.bg){
                        navigate('/canvas-bg')
                    }
                    modalsLocal.bg=true  
                    setModal(modalsLocal)
                    break;
                }
                if(isTestCompany1Area){
                    if(modalsLocal.testCompany1){
                        navigate('/test-assignment-1')
                    }
                    modalsLocal.testCompany1=true  
                    setModal(modalsLocal)
                    break;
                }
                if(isWeatherArea){
                    if(modalsLocal.weather){
                        navigate('/weather-app')
                    }
                    modalsLocal.weather=true  
                    setModal(modalsLocal)
                    break;
                }
                break;
            case 27: 
                closeModal()
                break
        }
    }, [modals])

    useEffect(()=>{
        window.addEventListener('keydown', openModal)

        return () => {
            window.removeEventListener('keydown', openModal)
        }
    }, [])
    //MODALS END
    
    class Sprite{
        constructor(position, image, frames = {max :1}){
            this.position ={x:position.x, y:position.y}
            this.frames = {...frames, current: 0, animSpeedCount: 0}
            this.image = image
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            this.moving = false
            this.offsetX = 0;
            this.offsetY = 0;
        }

        draw(){
            ctx.current.drawImage(
                this.image,
                this.frames.current * this.width,
                0,
                this.image.width / this.frames.max, 
                this.image.height,
                this.position.x + this.offsetX,
                this.position.y + this.offsetY,
                this.image.width/this.frames.max,
                this.image.height
                )
                
            if(this.frames.max>1){
                this.frames.animSpeedCount++
            }

            if(this.frames.animSpeedCount % (config.playerSpeed/playerSpeed * 5) == 0)
            if(this.frames.current < this.frames.max - 1)
                this.frames.current++ 
            else
                this.frames.current = 0
                
        }
    }

        class Boundary{
            static width  = config.pixTiles * config.zoomMap
            static height = config.pixTiles * config.zoomMap
                constructor(position){
                    this.position = position
                    this.width = Boundary.width
                    this.height = Boundary.height
                    
                }
        
                draw(){
                    ctx.current.fillStyle = 'red';
                    ctx.current.fillRect(this.position.x, this.position.y, Boundary.width, Boundary.height)
                }
        }

       function spawnArea(arr){
        let result = []
        arr.forEach((row, i) => {
            row.forEach((obj, j) =>{
                if(obj != 0 && sessionStorage.mapX)
                    result.push(new Boundary({
                        x: j * Boundary.width   + parseInt(sessionStorage.mapX),
                        y: i * Boundary.height  + parseInt(sessionStorage.mapY)
                    }))
                else if(obj != 0)
                result.push(new Boundary({
                    x: j * Boundary.width   + config.offsetX,
                    y: i * Boundary.height  + config.offsetY
                }))
            })
        })
        return result;
       }


       let boundaries, modalArea, welcomeBoardArea, codeEditorArea, comingSoonArea, holographArea, bgArea, testCompany1Area, weatherArea

    
    areas.layers.forEach(area =>{
        if(area.name == 'collision'){
            boundaries = spawnArea(arrayArea(area.data, config))
        }
        if(area.name == 'modalArea')
            modalArea = spawnArea(arrayArea(area.data, config))
        if(area.name == 'welcomeArea')
            welcomeBoardArea = spawnArea(arrayArea(area.data, config))
        if(area.name == 'codeEditorArea')
            codeEditorArea = spawnArea(arrayArea(area.data, config))
        if(area.name == 'comingSoonArea')
            comingSoonArea = spawnArea(arrayArea(area.data, config))
        if(area.name == 'holographArea')
            holographArea = spawnArea(arrayArea(area.data, config))
        if(area.name == 'bgArea')
            bgArea = spawnArea(arrayArea(area.data, config))
        if(area.name == 'testCompany1Area')
            testCompany1Area = spawnArea(arrayArea(area.data, config))
        if(area.name == 'weatherArea')
            weatherArea = spawnArea(arrayArea(area.data, config))
    })

        function lastPressedChoose(){
            if(pressedKeys.w)
                lastPressed = 'w'
            else if(pressedKeys.a)
                lastPressed = 'a'
            else if(pressedKeys.s)
                lastPressed = 's'
            else if(pressedKeys.d)
                lastPressed = 'd'
            else player.image = playerIdle
        }
        
        const pressKey = (e) =>{
            switch(e.keyCode){
                case 38:
                case 87: 
                    pressedKeys.w = true
                    lastPressed = 'w'
                    break;
                case 37: 
                case 65: 
                    pressedKeys.a = true
                    lastPressed = 'a'
                    break;
                case 40: 
                case 83: 
                    pressedKeys.s = true
                    lastPressed = 's'
                    break;
                case 39: 
                case 68: 
                    pressedKeys.d = true
                    lastPressed = 'd'
                    break;
                case 16:
                    pressedKeys.shift = true
                    break;
            }
        }

        const unpressKey = (e) =>{
            switch(e.keyCode){
                case 38:
                case 87: 
                    pressedKeys.w = false
                    lastPressedChoose()
                    break;
                case 37: 
                case 65: 
                    pressedKeys.a = false
                    lastPressedChoose()
                    break;
                case 40: 
                case 83: 
                    pressedKeys.s = false
                    lastPressedChoose()
                    break;
                case 39: 
                case 68: 
                    pressedKeys.d = false
                    lastPressedChoose()
                    break;
                case 16:
                    pressedKeys.shift = false
                    break;
            }
        }

            

    useEffect(()=>{
        resizeCNV();
        let animateID
            if(sessionStorage.mapX){
                map       = new Sprite({x:parseInt(sessionStorage.mapX), y:parseInt(sessionStorage.mapY)}, mapImage)
                front     = new Sprite({x:parseInt(sessionStorage.mapX), y:parseInt(sessionStorage.mapY)}, frontImage)
            }else{
                map       = new Sprite({x:config.offsetX, y:config.offsetY}, mapImage)
                front     = new Sprite({x:config.offsetX, y:config.offsetY}, frontImage)
            }
        player    = new Sprite({
            x: canvas.current.width /2  - (playerIdle.width /6) /2 , 
            y: canvas.current.height/2 - playerIdle.height /2,
        },
        playerIdle,
        {max: 6},
        playerIdle)

        const context  = canvas.current.getContext('2d') 
        ctx.current = context

        const movableItems = [map, ...boundaries, front, ...modalArea, ...welcomeBoardArea, ...holographArea, ...bgArea, ...testCompany1Area, ...weatherArea, ...codeEditorArea, ...comingSoonArea]
        
        
        window.addEventListener('keydown', pressKey)
        window.addEventListener('keyup', unpressKey)
        const animate = () => {
            animateID = requestAnimationFrame(animate);
            map.draw()
            player.draw()
            front.draw()


            if(player.moving && pressedKeys.shift)
                playerSpeed = config.playerSpeed *2
            else playerSpeed = config.playerSpeed

            player.moving = false
            if(pressedKeys.w && lastPressed == 'w'){
                let moving = true
                
                for(let i=0; i<boundaries.length; i++){
                    moving = !collisionMath(player, {...boundaries[i], position: {x: boundaries[i].position.x, y: boundaries[i].position.y + playerSpeed}})
                    if(!moving)
                        break;
                }   
                if(moving)
                {
                    player.moving = true
                    player.image = playerUp
                    if(player.offsetY<20)
                            player.offsetY+=playerSpeed
                    movableItems.forEach(item => item.position.y += playerSpeed)
                }
            }
            else  if(pressedKeys.a && lastPressed == 'a'){
                let moving = true
                for(let i=0; i<boundaries.length; i++){
                    moving = !collisionMath(player, {...boundaries[i], position: {x: boundaries[i].position.x + playerSpeed, y: boundaries[i].position.y}})
                    if(!moving)
                        break;
                }   
                if(moving)
                {
                    player.moving = true
                    player.image = playerLeft
                    if(player.offsetX<20)
                        player.offsetX += playerSpeed 
                        movableItems.forEach(item => item.position.x += playerSpeed)
                }
            }
            else if(pressedKeys.s && lastPressed == 's'){
                let moving = true
                for(let i=0; i<boundaries.length; i++){
                    moving = !collisionMath(player, {...boundaries[i], position: {x: boundaries[i].position.x, y: boundaries[i].position.y - playerSpeed}})
                    if(!moving)
                        break;
                }   
                if(moving){
                    player.moving = true
                    player.image = playerDown
                    if(player.offsetY>-20)
                        player.offsetY -= playerSpeed
                    movableItems.forEach(item => item.position.y -= playerSpeed)
                }       
            }
            else if(pressedKeys.d && lastPressed == 'd'){
                let moving = true
                for(let i=0; i<boundaries.length; i++){
                    moving = !collisionMath(player, {...boundaries[i], position: {x: boundaries[i].position.x - playerSpeed, y: boundaries[i].position.y}})
                    if(!moving)
                        break;
                }   
                if(moving){
                    player.moving = true
                    player.image = playerRight
                    if(player.offsetX>-20)
                    player.offsetX -= playerSpeed
                    movableItems.forEach(item => item.position.x -= playerSpeed)
                } 
            }

            //Modal areas START
            for(let i=0; i<modalArea.length;i++)
            {
                if(collisionMath(player, modalArea[i]))
                    {
                        setOpenModal(true)
                        break;
                    }
                    setOpenModal(false)
            }

            for(let i=0; i<welcomeBoardArea.length;i++)
            {
                if(collisionMath(player, welcomeBoardArea[i]))
                    {
                        isWelcomeBoardArea = true
                        break;
                    }
                    isWelcomeBoardArea = false
            }

            for(let i=0; i<weatherArea.length;i++)
            {
                if(collisionMath(player, codeEditorArea[i]))
                    {
                        isCodeEditorArea = true
                        break;
                    }
                    isCodeEditorArea = false
                if(collisionMath(player, comingSoonArea[i]))
                    {
                        isComingSoonArea = true
                        break;
                    }
                    isComingSoonArea = false
                if(collisionMath(player, holographArea[i]))
                    {
                        isHolographArea = true
                        break;
                    }
                    isHolographArea = false
                if(collisionMath(player, bgArea[i]))
                    {
                        isBgArea = true
                        break;
                    }
                    isBgArea = false
                if(collisionMath(player, testCompany1Area[i]))
                    {
                        isTestCompany1Area = true
                        break;
                    }
                    isTestCompany1Area = false
                if(collisionMath(player, weatherArea[i]))
                    {
                        isWeatherArea = true
                        break;
                    }
                    isWeatherArea = false
            }
            //Modal areas END

            sessionStorage.setItem('mapX', map.position.x)
            sessionStorage.setItem('mapY', map.position.y)
        }
        animate()

        

        return () => {
            cancelAnimationFrame(animateID);
            
            window.removeEventListener('keydown',   pressKey)
            window.removeEventListener('keyup',     unpressKey)
        }
    }, [])
    return ( 
    <div className={cl.wrapper} >
        <canvas ref ={canvas} className={cl.game}/>
    </div> );

    function closeModal(){
        const temp={}
                for(let key in modals){
                    temp[key] = false
                }
                modalsLocal = {...temp}
                setModal(temp)
    }
    function resizeCNV(){
        canvas.current.width   = window.innerWidth;
        canvas.current.height  = window.innerHeight;
    }

}


function arrayArea(source, config){
    const temp = []
        for(let i=0; i<source.length; i+=config.mapWidth){
            temp.push(source.slice(i, i + config.mapWidth))
        }
        return temp
}

function collisionMath(obj1, obj2){
    if(
        obj1.position.x + obj1.width       >= obj2.position.x                           &&                    
        obj1.position.x                    <= obj2.position.x + obj2.width              &&
        obj1.position.y                    <= obj2.position.y + obj2.height             &&
        obj1.position.y + obj1.height      >= obj2.position.y
    ){
       return true
    }
    return false
}

export default Game;