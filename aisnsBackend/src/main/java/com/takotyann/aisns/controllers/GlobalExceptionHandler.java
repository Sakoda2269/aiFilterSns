package com.takotyann.aisns.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.takotyann.aisns.exceptions.AccountNotFoundException;
import com.takotyann.aisns.exceptions.EmailConflictException;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(EmailConflictException.class)
	public ResponseEntity<String> handleUserAlreadyExistsException(EmailConflictException ex) {
		return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(AccountNotFoundException.class)
	public ResponseEntity<String> handleAccountNotFoundException(AccountNotFoundException ex) {
		return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
	}
	
	
}
