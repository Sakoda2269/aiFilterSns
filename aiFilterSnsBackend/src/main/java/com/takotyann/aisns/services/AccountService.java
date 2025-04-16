package com.takotyann.aisns.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.takotyann.aisns.config.security.AccountDetails;
import com.takotyann.aisns.dtos.AccountDto;
import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.entities.Follow;
import com.takotyann.aisns.entities.FollowId;
import com.takotyann.aisns.exceptions.AccountNotFoundException;
import com.takotyann.aisns.exceptions.EmailConflictException;
import com.takotyann.aisns.exceptions.LoginRequireException;
import com.takotyann.aisns.exceptions.PermissionDeniedException;
import com.takotyann.aisns.repositories.AccountRepository;
import com.takotyann.aisns.repositories.FollowRepository;

import java.util.List;
import java.util.UUID;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Process about account.
 */

@Service
@RequiredArgsConstructor
public class AccountService {

	private final AccountRepository accountRepository;
	private final PasswordEncoder encoder;
	private final FollowRepository followRepository;
	
	private static final boolean IS_SECURE = Boolean.parseBoolean(System.getenv("SECURE"));
	
	/**
	 * 
	 * Register new account. Throw EmailConflictException if email is duplicated.
	 * 
	 * @param email Account's email. This must not be duplicated.
	 * @param name Account's name.
	 * @param password Account's password.
	 * @return Id of created new account.
	 */
	public String registerAccount(String email, String name, String password) {
		if(accountRepository.existsByEmail(email)) {
			throw new EmailConflictException("this email has already used");
		}
		Account account = new Account();
		account.setEmail(email);
		account.setName(name);
		account.setPassword(encoder.encode(password));
		String id = UUID.randomUUID().toString();
		account.setAccountId(id);
		account.setRoles("ROLE_GENERAL");
		account.setIsEnabled(false);
		accountRepository.save(account);
		System.out.println(id);
		return id;
	}
	
	/**
	 * Find account by account id. Throw AccountNotFoundException if account is not found.
	 * @param accountId Id of account you want to find.
	 * @return Account.
	 */
	public Account getAccountById(String accountId) {
		return accountRepository.findById(accountId).orElseThrow(() -> new AccountNotFoundException("account not found"));
	}
	
	/**
	 * Find account by id and return accountDto. Throw AccountNotFoundException if account is not found.
	 * @param accountId Id of account you want to find.
	 * @return AccountDto.
	 */
	public AccountDto getAccountDtoById(String accountId) {
		Account account = getAccountById(accountId);
		int followerNum = followRepository.getFollowerNum(accountId);
		int followeeNum = followRepository.getFolloweeNum(accountId);
		AccountDto accountDto = new AccountDto(account);
		accountDto.setFollowerNum(followerNum);
		accountDto.setFolloweeNum(followeeNum);
		Account logined = getLoginedAccount();
		if(logined != null && !logined.getAccountId().equals(accountId)) {
			boolean following = followRepository.isFollowing(logined.getAccountId(), accountId);
			accountDto.setFollowing(following);
		}
		return accountDto;
	}
	
	/**
	 * Get all accounts.
	 * @return All accounts.
	 */
	public List<Account> getAllAccounts() {
		return accountRepository.findAll();
	}
	
	/**
	 * Get current logined account.
	 * @return logined account. Return null if unauthorized.
	 */
	public Account getLoginedAccount() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(auth != null && auth.isAuthenticated()) {
			Object principal = auth.getPrincipal();
			if(principal instanceof AccountDetails) {
				String accountId = ((AccountDetails) principal).getUsername();
				Account account = getAccountById(accountId);
				return account;
			}
		}
		return null;
	}
	
	/**
	 * Delete logined account. 
	 * Throw LogineRequireException if account is unauthorized.
	 * @param password password of account you want to delete.
	 * @param res HttpServletResponse.
	 */
	public void deleteAccount(String password, HttpServletResponse res) {
		logout(res);
		Account logined = getLoginedAccount();
		if(logined == null) {
			throw new LoginRequireException("login require");
		}
		if(encoder.matches(password, logined.getPassword())) {
			accountRepository.deleteById(logined.getAccountId());
		} else {
			throw new PermissionDeniedException("password check failed");
		}
	}
	
	/**
	 * Follow for follower to account whose accountId is followeedId.
	 * @param follower account to follow.
	 * @param followeeId Id of followed account.
	 * @return Number of followee's followers.
	 */
	public int follow(Account follower, String followeeId) {
		Follow follow = new Follow();
		follow.setFollowId(new FollowId(follower.getAccountId(), followeeId));
		followRepository.save(follow);
		return followRepository.getFollowerNum(followeeId);
	}
	
	/**
	 * UnFollow for follower to account whose accountId is param's accountId.
	 * @param follower Account to unfollow.
	 * @param accountId Id of unfollowed account. 
	 * @return Number of followee's followers.
	 */
	public int unFollow(Account follower, String accountId) {
		followRepository.deleteById(new FollowId(follower.getAccountId(), accountId));
		return followRepository.getFollowerNum(accountId);
	}
	
	/**
	 * Logout. Delete cookie having JWT.
	 * @param res HttpServletResponse.
	 */
	public void logout(HttpServletResponse res) {
		Cookie cookie = new Cookie("token", null);
		cookie.setMaxAge(0);
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		cookie.setSecure(IS_SECURE);
		res.addCookie(cookie);
	}
	
}
