import { AbstractControl } from '@angular/forms';

export interface IUserCreate{
    id?: number,
    firstName: string,
    secondaryName: {secondaryName: string}[],
    userName: string,
    emailAddress?: string,
    password: string
}

export interface IUserAccount{
    userName: string,
    profileImage?: string,
    firstName?: string,
    secondaryName?: string
}

export interface IPosts{
    id?: number,
    url: string,
    likes: number,
    dislikes: number,
    Rating: number,
    score?: number
}

// export interface ImageDetail{
//     rate: number,
//     likes: number,
//     dislikes: number
// }
// io.ionic.starter
