import type { SVGProps } from "react-html-props"

export const IconSpinner = (props: SVGProps) => {
    return (
      <svg
        {...props}
        aria-hidden="true"
        stroke="currentColor"
        fill="none"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          fill="currentColor"
        ></path>
        <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor"></path>
      </svg>
    )
  }


export const IconCaretUp = (props: SVGProps) => {
  return <svg {...props} aria-hidden="true" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path></svg>
}

export const IconCaretDown = (props: SVGProps) => {
  return <svg {...props} aria-hidden="true" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg>
}

export const IconClose = (props: SVGProps) => {
  return <svg
  {...props}
  aria-hidden="true"
  fill="none"
  height="10"
  viewBox="0 0 10 10"
  width="10"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z"
    fill="currentColor"
  ></path>
</svg>
}

export const IconPoweredByVercel = (props: SVGProps) => {
  return <svg viewBox="0 0 4438 1000" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
  <path d="M2223.75 250C2051.25 250 1926.87 362.5 1926.87 531.25C1926.87 700 2066.72 812.5 2239.38 812.5C2343.59 812.5 2435.47 771.25 2492.34 701.719L2372.81 632.656C2341.25 667.188 2293.28 687.344 2239.38 687.344C2164.53 687.344 2100.94 648.281 2077.34 585.781H2515.16C2518.59 568.281 2520.63 550.156 2520.63 531.094C2520.63 362.5 2396.41 250 2223.75 250ZM2076.09 476.562C2095.62 414.219 2149.06 375 2223.75 375C2298.59 375 2352.03 414.219 2371.41 476.562H2076.09ZM2040.78 78.125L1607.81 828.125L1174.69 78.125H1337.03L1607.66 546.875L1878.28 78.125H2040.78ZM577.344 0L1154.69 1000H0L577.344 0ZM3148.75 531.25C3148.75 625 3210 687.5 3305 687.5C3369.38 687.5 3417.66 658.281 3442.5 610.625L3562.5 679.844C3512.81 762.656 3419.69 812.5 3305 812.5C3132.34 812.5 3008.13 700 3008.13 531.25C3008.13 362.5 3132.5 250 3305 250C3419.69 250 3512.66 299.844 3562.5 382.656L3442.5 451.875C3417.66 404.219 3369.38 375 3305 375C3210.16 375 3148.75 437.5 3148.75 531.25ZM4437.5 78.125V796.875H4296.88V78.125H4437.5ZM3906.25 250C3733.75 250 3609.38 362.5 3609.38 531.25C3609.38 700 3749.38 812.5 3921.88 812.5C4026.09 812.5 4117.97 771.25 4174.84 701.719L4055.31 632.656C4023.75 667.188 3975.78 687.344 3921.88 687.344C3847.03 687.344 3783.44 648.281 3759.84 585.781H4197.66C4201.09 568.281 4203.12 550.156 4203.12 531.094C4203.12 362.5 4078.91 250 3906.25 250ZM3758.59 476.562C3778.13 414.219 3831.41 375 3906.25 375C3981.09 375 4034.53 414.219 4053.91 476.562H3758.59ZM2961.25 265.625V417.031C2945.63 412.5 2929.06 409.375 2911.25 409.375C2820.47 409.375 2755 471.875 2755 565.625V796.875H2614.38V265.625H2755V409.375C2755 330 2847.34 265.625 2961.25 265.625Z" fill="white"/>
  </svg>
  
}


export const IconEditorBold = (props: SVGProps) => {
  return (
    <span aria-hidden="true" className={`bold uppercase ${props?.className ?? ''}`}>
      B
    </span>
  )
}

export const IconEditorItalic = (props: SVGProps) => {
  return (
    <span aria-hidden="true" className={`italic uppercase ${props?.className ?? ''}`}>
      I
    </span>
  )
}

export const IconEditorUnderline = (props: SVGProps) => {
  return (
    <span aria-hidden="true" className={`underline uppercase ${props?.className ?? ''}`}>
      U
    </span>
  )
}

export const IconEditorStrike = (props: SVGProps) => {
  return (
    <span aria-hidden="true" className={`strike uppercase ${props?.className ?? ''}`}>
      S
    </span>
  )
}

export const IconEditorH1 = (props: SVGProps) => {
  return (
    <span aria-hidden="true" className={`font-bold uppercase ${props?.className ?? ''}`}>
      H1
    </span>
  )
}

export const IconEditorH2 = (props: SVGProps) => {
  return (
    <span aria-hidden="true" className={`font-bold uppercase ${props?.className ?? ''}`}>
      H2
    </span>
  )
}

export const IconEditorH3 = (props: SVGProps) => {
  return (
    <span aria-hidden="true" className={`font-bold uppercase ${props?.className ?? ''}`}>
      H3
    </span>
  )
}

export const IconEditorH4 = (props: SVGProps) => {
  return (
    <span aria-hidden="true" className={`font-bold uppercase ${props?.className ?? ''}`}>
      H4
    </span>
  )
}

export const IconEditorH5 = (props: SVGProps) => {
  return (
    <span aria-hidden="true" className={`font-bold uppercase ${props?.className ?? ''}`}>
      H5
    </span>
  )
}

export const IconEditorParagraph = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M12 6v15h-2v-5a6 6 0 1 1 0-12h10v2h-3v15h-2V6h-3zm-2 0a4 4 0 1 0 0 8V6z"></path>
      </g>
    </svg>
  )
}

export const IconEditorAnchor = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.222 19.778a4.983 4.983 0 0 0 3.535 1.462 4.986 4.986 0 0 0 3.536-1.462l2.828-2.829-1.414-1.414-2.828 2.829a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.829-2.828-1.414-1.414-2.829 2.828a5.006 5.006 0 0 0 0 7.071zm15.556-8.485a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0L9.879 7.051l1.414 1.414 2.828-2.829a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.829 2.828 1.414 1.414 2.829-2.828z"
      ></path>
      <path d="m8.464 16.95-1.415-1.414 8.487-8.486 1.414 1.415z"></path>
    </svg>
  )
}

export const IconEditorRemoveAnchor = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M16.949 14.121 19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0l-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121a2.723 2.723 0 0 1-.844.57L13.414 12l1.414-1.414-.707-.707a4.965 4.965 0 0 0-3.535-1.465c-.235 0-.464.032-.691.066L3.707 2.293 2.293 3.707l18 18 1.414-1.414-5.536-5.536c.277-.184.538-.396.778-.636zm-6.363 3.536a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l1.476-1.475-1.414-1.414L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707z"></path>
    </svg>
  )
}

export const IconEditorCode = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M160 368L32 256l128-112m192 224l128-112-128-112"
      ></path>
    </svg>
  )
}

export const IconEditorCodeBlock = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V7h16l.002 12H4z"></path>
      <path d="M9.293 9.293 5.586 13l3.707 3.707 1.414-1.414L8.414 13l2.293-2.293zm5.414 0-1.414 1.414L15.586 13l-2.293 2.293 1.414 1.414L18.414 13z"></path>
    </svg>
  )
}

export const IconEditorImage = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M20 5H4v14l9.292-9.294a1 1 0 0 1 1.414 0L20 15.01V5zM2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path>
      </g>
    </svg>
  )
}

export const IconEditorQuote = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
      </g>
    </svg>
  )
}

export const IconEditorDivider = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 1024 1024"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M904 476H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
    </svg>
  )
}

export const IconEditorListUnordered = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M8 4h13v2H8V4zm-5-.5h3v3H3v-3zm0 7h3v3H3v-3zm0 7h3v3H3v-3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"></path>
      </g>
    </svg>
  )
}

export const IconEditorListOrdered = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"></path>
      </g>
    </svg>
  )
}

export const IconEditorUndo = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9 10h6c1.654 0 3 1.346 3 3s-1.346 3-3 3h-3v2h3c2.757 0 5-2.243 5-5s-2.243-5-5-5H9V5L4 9l5 4v-3z"></path>
    </svg>
  )
}

export const IconEditorRedo = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9 18h3v-2H9c-1.654 0-3-1.346-3-3s1.346-3 3-3h6v3l5-4-5-4v3H9c-2.757 0-5 2.243-5 5s2.243 5 5 5z"></path>
    </svg>
  )
}

export const IconEditorClearFormat = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M12.651 14.065L11.605 20H9.574l1.35-7.661-7.41-7.41L4.93 3.515 20.485 19.07l-1.414 1.414-6.42-6.42zm-.878-6.535l.27-1.53h-1.8l-2-2H20v2h-5.927L13.5 9.257 11.773 7.53z"></path>
      </g>
    </svg>
  )
}

export const IconEditorTextCenter = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M3 4h18v2H3V4zm2 15h14v2H5v-2zm-2-5h18v2H3v-2zm2-5h14v2H5V9z"></path>
      </g>
    </svg>
  )
}

export const IconEditorTextLeft = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M3 4h18v2H3V4zm0 15h14v2H3v-2zm0-5h18v2H3v-2zm0-5h14v2H3V9z"></path>
      </g>
    </svg>
  )
}

export const IconEditorTextRight = (props: SVGProps) => {
  return (
    <svg
      aria-hidden="true"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M3 4h18v2H3V4zm4 15h14v2H7v-2zm-4-5h18v2H3v-2zm4-5h14v2H7V9z"></path>
      </g>
    </svg>
  )
}
