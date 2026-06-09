const NAV_BAR = document.getElementById('navBar')
const NAV_LIST = document.getElementById('navList')
const HERO_HEADER = document.getElementById('heroHeader')
const HAMBURGER_BTN = document.getElementById('hamburgerBtn')
const NAV_LINKS = Array.from( document.querySelectorAll('.nav__list-link'))
const SERVICE_BOXES = document.querySelectorAll('.service-card__box')
const ACTIVE_LINK_CLASS = 'active'
const BREAKPOINT = 576

const lerp = (start, end, alpha) => start + (end - start) * alpha

let currentActiveLink = document.querySelector('.nav__list-link.active')

// Remove the active state once the breakpoint is reached
const resetActiveState = ()=>{
  NAV_LIST.classList.remove('nav--active')
  Object.assign(NAV_LIST.style, {
    height: null
  })
  Object.assign(document.body.style, {
    overflowY: null
  })
}

//Add padding to the header to make it visible because navbar has a fixed position.
const addPaddingToHeroHeaderFn = () => {
  const NAV_BAR_HEIGHT = NAV_BAR.getBoundingClientRect().height
  const HEIGHT_IN_REM = NAV_BAR_HEIGHT / 10

  // If hamburger button is active, do not add padding
  if (NAV_LIST.classList.contains('nav--active')) {
    return
  }
  Object.assign(HERO_HEADER.style, {
    paddingTop: HEIGHT_IN_REM + 'rem'
  })
}
addPaddingToHeroHeaderFn()
window.addEventListener('resize', ()=>{
  addPaddingToHeroHeaderFn()

  // When the navbar is active and the window is being resized, remove the active state once the breakpoint is reached
  if(window.innerWidth >= BREAKPOINT){
    addPaddingToHeroHeaderFn()
    resetActiveState()
  }
})

// As the user scrolls, the active link should change based on the section currently displayed on the screen.
window.addEventListener('scroll', ()=>{
  const sections = document.querySelectorAll('#heroHeader, #services, #works, #contact')

  // Loop through sections and check if they are visible
  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const NAV_BAR_HEIGHT = NAV_BAR.getBoundingClientRect().height
    if (window.scrollY >= sectionTop - NAV_BAR_HEIGHT) {
      const ID = section.getAttribute('id')
      const LINK = NAV_LINKS.filter(link => {
        return link.href.includes('#'+ID)
      })[0]
      currentActiveLink.classList.remove(ACTIVE_LINK_CLASS)
      LINK.classList.add(ACTIVE_LINK_CLASS)
      currentActiveLink = LINK
    }
  })
})

// Shows & hide navbar on smaller screen
HAMBURGER_BTN.addEventListener('click', ()=>{
  NAV_LIST.classList.toggle('nav--active')
  if (NAV_LIST.classList.contains('nav--active')) {
    Object.assign(document.body.style, {
      overflowY: 'hidden'
    })
    Object.assign(NAV_LIST.style, {
      height: '100vh'
    })
    return
  }
  Object.assign(NAV_LIST.style, {
    height: 0
  })
  Object.assign(document.body.style, {
    overflowY: null
  })
})

// When navbar link is clicked, reset the active state
NAV_LINKS.forEach(link => {
  link.addEventListener('click', ()=>{
    resetActiveState()
    link.blur()
  })
})

SERVICE_BOXES.forEach(service => {
  console.log(service.nodeName)
  const BG = service.querySelector('.service-card__bg')
  if (!BG) {
    console.log('nuh uh')
    return
  }

  let currentX = 0, currentY = 0
  let targetX = 0, targetY = 0

  const updateLoop = () => {
    currentX = lerp(currentX, targetX, 0.1)
    currentY = lerp(currentY, targetY, 0.1)

    BG.style.left = `${currentX}px`
    BG.style.top = `${currentY}px`
    
    requestAnimationFrame(updateLoop)
  }
  updateLoop()

  service.addEventListener('mouseenter', (e) => {
    console.log("mouse enter")
    const rect = service.getBoundingClientRect()
    currentX = e.clientX - rect.left
    currentY = e.clientY - rect.top
    targetX = currentX
    targetY = currentY
  })

  service.addEventListener('mousemove', (e) => {
    console.log("mouse move")
    const rect = service.getBoundingClientRect()
    targetX = e.clientX - rect.left
    targetY = e.clientY - rect.top
  })

  service.addEventListener('mouseleave', () => {
    console.log("mouse leave")
    const IMG_POS = service.querySelector('.service-card__illustration')
    const bgRect = BG.getBoundingClientRect()
    targetX = IMG_POS.offsetLeft + bgRect.width
    targetY = IMG_POS.offsetTop + bgRect.height
  })
})

// Handles smooth scrolling
new SweetScroll({
  trigger: '.nav__list-link',
  easing: 'easeOutQuint',
  offset: NAV_BAR.getBoundingClientRect().height - 80
})