
"use client";
import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";

const openRoutes = ["/login"];
export default function middleware(req: NextRequest) {
    const userToken = req.cookies.get("token");
    let absoluteUrl = null;
    if (
        !userToken &&
        !openRoutes.includes(req?.nextUrl?.pathname)
    ) {
        absoluteUrl = new URL("/login", req.nextUrl.origin);
        return NextResponse.redirect(absoluteUrl.toString());
    }
    else{
        return NextResponse.next();
    }
    
}
