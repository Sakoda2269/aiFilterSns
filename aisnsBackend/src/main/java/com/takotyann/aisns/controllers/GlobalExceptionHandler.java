package com.takotyann.aisns.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.takotyann.aisns.exceptions.AccountNotFoundException;
import com.takotyann.aisns.exceptions.EmailConflictException;
import com.takotyann.aisns.exceptions.PermissionDeniedException;
import com.takotyann.aisns.exceptions.PostNotFoundException;

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
	
	@ExceptionHandler(PostNotFoundException.class)
	public ResponseEntity<String> handlePostNotFoundException(PostNotFoundException ex) {
		return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(PermissionDeniedException.class)
	public ResponseEntity<String> handlePermissionDeniedException(PermissionDeniedException ex) {
		return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
	}
	
}
