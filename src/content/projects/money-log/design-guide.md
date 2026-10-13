---
title: "2-2. 디자인 가이드"
description: "MoneyLog 화면을 구현할 때 참고할 색상과 공통 입력 컴포넌트의 상태 기준"
date: "2026-10-13"
tags:
  - MoneyLog
  - Design System
  - UI Component
---


![머니로그 디자인 가이드](moneylog-design-guide.png)

## 1. 색상 기준

- **Primary**: 브랜드 메인 컬러 (그린)
- **Secondary**: 지출 관련 태그와 버튼에 사용한다
- **Income**: 수입 관련 태그와 버튼에 사용한다.
- **Text / Text Muted**: 제목 본문과 날짜,설명처럼 정보 텍스트에 사용
- **Border / Surface**: 카드, 입력 필드, 모달의 경계와 배경에 사용

## 2. 버튼

버튼은 기본, hover, 비활성 상태를 구분한다.

- 대부분의 기본 버튼은 Primary 색상을 사용한다.
- 지출과 수입 버튼은 각각 Secondary, Income 색상으로 구분한다.
- 취소 버튼 또는 보조버튼은 강조가 낮은 고스트 형태로 사용한다.

## 3. 입력 컴포넌트

Input, Textarea, Select Box, Datepicker - 기본, 포커스, 입력됨, 오류, 비활성 상태

- 포커스 :  Primary 테두리로 현재 입력 위치를 알린다.
- 오류 : Danger 색상과 안내 문구를 함께 보여준다.
- 비활성 상태 : 배경과 글자색을 낮춰 입력할 수 없음을 표현한다.

## 4. Select Box 컴포넌트

Checkbox와 Radio Box는 기본, 선택됨, 비활성 상태를 제공한다.
- Checkbox는 반복 등록처럼 여러 선택이 가능한 항목에 사용한다.
- Radio Box는 수입·지출처럼 하나만 선택해야 하는 항목에 사용한다.
- 선택 상태는 Primary 색상으로 명확하게 구분한다.
