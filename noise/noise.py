#!/usr/bin/env python2
import sys
import math
import random

TEMPO=1000

def p(i):
    sys.stdout.write(chr(i % 255))

def q(n):
    p(int(math.floor(n*100)))

def playfloor(n, freq=1):
    a = 0
    n *= TEMPO
    while a/freq < n:
        a += freq
        q(math.floor(a))

def playnoise(n):
    a = 0
    n *= TEMPO
    while a < n:
        a += 1
        q(random.randint(0,254))

def playsin(n, freq=1):
    a = 0
    n *= TEMPO
    while a/freq < n:
        a += freq
        q(math.cos(a))

def silence(n):
    a = 0
    n *= TEMPO
    while a < n:
        a += 1
        p(0)

def beat():
    playfloor(2, 0.01)
    silence(2)
    playfloor(2, 0.01)
    silence(2)
    playnoise(2)
    silence(6)

while True:
    beat()

    for i in range(1, 16):
        playsin(1, 0.5*(16-i))

    beat()

    for i in range(1, 16):
        playfloor(1, 0.5*i)

    if (TEMPO - 100 > 200):
        TEMPO-=100
    else:
        while True:
            playnoise(2)
            silence(2)

