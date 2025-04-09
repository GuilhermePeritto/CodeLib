"use client"

import type React from "react"

import { useEffect, useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
  return `${count++}`
}

export function toast({ title, description, action, variant }: Omit<ToastProps, "id">) {
  const id = generateId()

  const toasts = getToasts()
  const newToasts = [...toasts, { id, title, description, action, variant }]
  setToasts(newToasts)

  setTimeout(() => {
    dismissToast(id)
  }, TOAST_REMOVE_DELAY)

  return {
    id,
    dismiss: () => dismissToast(id),
  }
}

function dismissToast(id: string) {
  const toasts = getToasts()
  const newToasts = toasts.filter((toast) => toast.id !== id)
  setToasts(newToasts)
}

// Simple in-memory store for toasts
let toasts: ToastProps[] = []

function getToasts() {
  return toasts
}

function setToasts(newToasts: ToastProps[]) {
  toasts = newToasts
  document.dispatchEvent(new CustomEvent("toast-change", { detail: newToasts }))
}

export function useToast() {
  const [localToasts, setLocalToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    const handleToastChange = (e: CustomEvent<ToastProps[]>) => {
      setLocalToasts(e.detail)
    }

    document.addEventListener("toast-change", handleToastChange as EventListener)
    setLocalToasts(getToasts())

    return () => {
      document.removeEventListener("toast-change", handleToastChange as EventListener)
    }
  }, [])

  return {
    toasts: localToasts,
    toast,
    dismiss: dismissToast,
  }
}
