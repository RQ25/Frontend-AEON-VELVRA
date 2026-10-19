import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export const ButtonInfo = ({
  children,
  type,
  onClick,
  className,
}: Props) => {
  return (
    <button
      className={`text-sm bg-amber-600 text-white rounded-md py-2 px-4 hover:bg-amber-700 font-bold ${className}`}
      type={type}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};

export const ButtonSuccess = ({
  children,
  type,
  onClick,
  className,
}: Props) => {
  return (
    <button
      className={`text-sm bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 font-bold ${className}`}
      type={type}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};

export const ButtonWarning = ({
  children,
  type,
  onClick,
  className,
}: Props) => {
  return (
    <button
      className={`text-sm bg-yellow-500 text-white rounded-md py-2 px-4 hover:bg-yellow-600 font-bold ${className}`}
      type={type}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};

export const ButtonDanger = ({ children, type, onClick, className, disabled }: Props) => {
  const disable = disabled === true
  if(disable) {
    return (
      <button
        className={`text-sm bg-red-600 text-white rounded-md py-2 px-4 hover:bg-red-700 font-bold ${className}`}
        type={type}
        disabled
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {children}
      </button>
    );
  } else {
    return (
      <button
        className={`text-sm bg-red-600 text-white rounded-md py-2 px-4 hover:bg-red-700 font-bold ${className}`}
        type={type}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {children}
      </button>
    );
    
  }
};

// Button Primary
export const ButtonPrimary = ({
  children,
  type,
  onClick,
  className,
  disabled
}: Props) => {
  const disable = disabled === true
  if(disable) {
    return (
      <button
        className={`text-sm bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 font-bold ${className}`}
        type={type}
        disabled
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {children}
      </button>
    );
  } else {
    return (
      <button
        className={`text-sm bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 font-bold ${className}`}
        type={type}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {children}
      </button>
    )
    };
  }



//wawsdftgauywihuoijpdegdbnmdaw

    export const SuccessOutlaneButton = ({ children, type, onClick, className }: Props) => {
        return (
            <button className={`text-sm bg-white outline outline-offset-2 outline-1 outline-green-500 text-green-500 rounded-md py-2 px-4 hover:bg-green-700 hover:text-white font-bold ${className}`}
                type={type} onClick={() => { if (onClick) onClick() }}>
    {children}
        </button>
    )
}

    export const WarningOutlaneButton = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-white outline outline-offset-2 outline-1 outline-yellow-500 text-yellow-500 rounded-md py-2 px-4 hover:bg-yellow-600 hover:text-white font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}

    export const DangerOutlaneButton = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-white outline outline-offset-2 outline-1 outline-red-500 text-red-500 rounded-md py-2 px-4 hover:bg-red-700 hover:text-white font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}