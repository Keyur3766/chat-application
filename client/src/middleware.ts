
"use client";
import { NextRequest, NextResponse } from "next/server";

const openRoutes = ["/login", "/register"];
export default function middleware(req: NextRequest) {
    const userToken = req.cookies.get("token");
    let absoluteUrl = null;
    if (
        !userToken &&
        !openRoutes.includes(req?.nextUrl?.pathname)
    ) {
        absoluteUrl = new URL("/login", req.nextUrl.origin);
        // let url = req.nextUrl.clone();
        // url.pathname = '/login'
        
        return NextResponse.redirect(absoluteUrl.toString());
    }
    
    return NextResponse.next();
    
}

export const config = { matcher: '/((?!.*\\.).*)' }
