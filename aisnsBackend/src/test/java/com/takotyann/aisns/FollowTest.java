package com.takotyann.aisns;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
@SpringBootTest()
public class FollowTest {
	
	@Autowired
	private MockMvc mockMvc;
	
	@Test
	public void createAccountAndFollow() throws Exception {
		
		AccountForTest account1 = new AccountForTest("test2@gmail.com", "sakoda2", "tako2", mockMvc);
		AccountForTest account2 = new AccountForTest("test3@gmail.com", "sakoda3", "tako3", mockMvc);
		AccountForTest account3 = new AccountForTest("test4@gmail.com", "sakoda4", "tako4", mockMvc);
		AccountForTest account4 = new AccountForTest("test5@gmail.com", "sakoda5", "tako5", mockMvc);
		
		account1.follow(account2);
		account1.follow(account3);
		
		account1.posts("i am sakoda2");
		account2.posts("hello world");
		account3.posts("good morning");
		account3.posts("i am in Tokyo");
		account4.posts("have a nice day");
		
		Map<String, Set<String>> correct = new HashMap<>();
		correct.put(account1.getId(), new HashSet<>());
		correct.put(account2.getId(), new HashSet<>());
		correct.put(account3.getId(), new HashSet<>());
		correct.get(account1.getId()).add("i am sakoda2");
		correct.get(account2.getId()).add("hello world");
		correct.get(account3.getId()).add("good morning");
		correct.get(account3.getId()).add("i am in Tokyo");
		
		var res = account1.getTimeLine();
		assertEquals(correct, res);
	}
	
}
